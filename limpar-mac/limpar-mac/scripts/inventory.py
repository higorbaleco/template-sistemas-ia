#!/usr/bin/env python3
"""Read-only local triage. JSON on stdout; never grants deletion readiness."""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import platform
import stat
import subprocess
import time

DAY = 86400
VIDEOS = {'.mp4', '.mov', '.m4v', '.mkv', '.avi', '.webm', '.mts', '.m2ts'}
MARKERS = {'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod',
           'composer.json', 'Gemfile', 'pom.xml', 'build.gradle'}
DISCOVERY_SKIP = {'.git', 'node_modules', '.venv', 'venv', '__pycache__',
                  '.next', '.Trash', 'CloudStorage', 'Mobile Documents'}
PACKAGES = ('.photoslibrary', '.photolibrary', '.imovielibrary', '.fcpbundle',
            '.app', '.backupbundle', '.sparsebundle')


def stamp(value):
    return dt.datetime.fromtimestamp(value, dt.timezone.utc).isoformat()


def git(path, *args):
    env = os.environ.copy()
    env.update(GIT_OPTIONAL_LOCKS='0', GIT_TERMINAL_PROMPT='0', LC_ALL='C')
    # Avoid repository selection through inherited shell environment.
    for key in ('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR'):
        env.pop(key, None)
    result = subprocess.run(
        ['git', '-c', 'core.fsmonitor=false', '-C', str(path), *args],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env, timeout=120)
    if result.returncode:
        # Raw stderr can contain credential-bearing remote URLs.
        raise RuntimeError('git ' + args[0] + ' failed: ' + str(result.returncode))
    return result.stdout.decode('utf-8', errors='surrogateescape')


def audit(path):
    p = Path(path).expanduser().absolute()
    out = {'path': str(p), 'deletion_ready': False, 'remote_verified': False,
           'errors': []}
    try:
        top = git(p, 'rev-parse', '--show-toplevel').strip()
        if Path(top).resolve() != p.resolve():
            raise RuntimeError('Path is not the repository root')
        out['head'] = git(p, 'rev-parse', '--verify', 'HEAD').strip()
        refs = git(p, 'for-each-ref', '--format=%(objectname) %(refname)')
        out['refs'] = [dict(zip(('oid', 'ref'), line.split(' ', 1)))
                       for line in refs.splitlines()]
        # Porcelain -z rename/copy records have an extra source-path token.
        tokens = git(p, 'status', '--porcelain=v1', '-z',
                     '--untracked-files=all', '--ignore-submodules=none').split('\0')
        tracked = untracked = 0
        i = 0
        while i < len(tokens):
            record = tokens[i]
            if record:
                if record.startswith('??'):
                    untracked += 1
                else:
                    tracked += 1
                    if 'R' in record[:2] or 'C' in record[:2]:
                        i += 1
            i += 1
        out['changed_tracked_entries'] = tracked
        out['untracked_files'] = untracked
        ignored = git(p, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z')
        out['ignored_files'] = len([v for v in ignored.split('\0') if v])
        stashes = git(p, 'stash', 'list', '--format=%H')
        out['stash_oids'] = stashes.splitlines()
        out['remote_names'] = git(p, 'remote').splitlines()
        out['git_dir'] = git(p, 'rev-parse', '--absolute-git-dir').strip()
        common = git(p, 'rev-parse', '--git-common-dir').strip()
        out['common_dir'] = str((p / common).resolve())
        out['linked_git_metadata'] = (p / '.git').is_file()
        out['worktree_count'] = sum(1 for line in git(
            p, 'worktree', 'list', '--porcelain').splitlines()
            if line.startswith('worktree '))
        out['has_submodules'] = (p / '.gitmodules').exists()
        out['shallow'] = git(p, 'rev-parse', '--is-shallow-repository').strip() == 'true'
        out['alternates_file'] = (Path(out['common_dir']) / 'objects/info/alternates').exists()
        dates = git(p, 'log', '--all', '--reflog', '--format=%ct').splitlines()
        out['latest_commit_epoch'] = max((int(x) for x in dates), default=0)
        out['complete'] = True
    except (OSError, RuntimeError, subprocess.TimeoutExpired, ValueError) as exc:
        out['errors'].append(str(exc))
        out['complete'] = False
    return out


def stats(path):
    """No symlink following or crossing mounts. Errors/skips block conclusions."""
    result = {'logical_bytes': 0, 'files': 0, 'latest_epoch': 0,
              'errors': [], 'skipped': [], 'nested_git': []}
    seen = set()
    try:
        root_stat = path.lstat()
    except OSError as exc:
        result['errors'].append({'path': str(path), 'error': type(exc).__name__})
        result['complete'] = False
        return result
    device = root_stat.st_dev
    stack = [path]
    while stack:
        item = stack.pop()
        try:
            st = item.lstat()
            result['latest_epoch'] = max(result['latest_epoch'], st.st_mtime)
            if stat.S_ISLNK(st.st_mode):
                result['skipped'].append({'path': str(item), 'reason': 'symlink'})
            elif st.st_dev != device:
                result['skipped'].append({'path': str(item), 'reason': 'mount'})
            elif stat.S_ISDIR(st.st_mode):
                if item != path and (item.name in {'.Trash', 'CloudStorage', 'Mobile Documents'}
                                     or item.name.lower().endswith(PACKAGES)):
                    result['skipped'].append({'path': str(item), 'reason': 'protected_container'})
                    continue
                if item != path and item.name == '.git' and item.parent != path:
                    result['nested_git'].append(str(item.parent))
                stack.extend(item.iterdir())
            elif stat.S_ISREG(st.st_mode):
                if item.name == '.git' and item.parent != path:
                    result['nested_git'].append(str(item.parent))
                key = (st.st_dev, st.st_ino)
                if key not in seen:
                    result['logical_bytes'] += st.st_size
                    result['files'] += 1
                    seen.add(key)
            else:
                result['skipped'].append({'path': str(item), 'reason': 'special_file'})
        except OSError as exc:
            result['errors'].append({'path': str(item), 'error': type(exc).__name__})
    result['complete'] = not result['errors'] and not result['skipped']
    return result


def walk(root, skipped, errors):
    device = root.stat().st_dev

    def onerror(exc):
        errors.append({'path': str(exc.filename), 'error': type(exc).__name__})

    for base, dirs, files in os.walk(root, followlinks=False, onerror=onerror):
        for name in list(dirs):
            p = Path(base) / name
            try:
                reason = None
                if p.is_symlink():
                    reason = 'symlink'
                elif name in DISCOVERY_SKIP or name.lower().endswith(PACKAGES):
                    reason = 'excluded_directory'
                elif p.stat().st_dev != device:
                    reason = 'mount'
                if reason:
                    dirs.remove(name)
                    skipped.append({'path': str(p), 'reason': reason})
            except OSError as exc:
                dirs.remove(name)
                onerror(exc)
        yield Path(base), dirs, files


def roots(values, report):
    found = []
    for value in values:
        p = Path(os.path.abspath(os.path.expanduser(value)))
        try:
            resolved = p.resolve(strict=True)
            if not p.is_dir() or p != resolved:
                raise ValueError('Use a real directory without symlink components')
            if p == Path(p.anchor) or p == Path.home().resolve():
                raise ValueError('Choose narrower roots, not system root or home')
            if any(part in {'.Trash', 'CloudStorage', 'Mobile Documents'}
                   or part.lower().endswith(PACKAGES) for part in p.parts):
                raise ValueError('Protected/cloud root requires a separate explicit workflow')
            if any(p == x or x in p.parents for x in found):
                continue
            found = [x for x in found if p not in x.parents]
            found.append(p)
        except (OSError, ValueError, RuntimeError) as exc:
            report['errors'].append({'path': str(p), 'error': str(exc)})
    return found


def scan(args):
    now = time.time()
    report = {'generated_at': stamp(now), 'machine': platform.node(),
              'system': platform.system(), 'project_days': args.project_days,
              'video_days': args.video_days, 'deletion_ready': False,
              'projects': [], 'videos': [], 'caches': [], 'errors': [], 'skipped': []}
    for root in roots(args.project_root, report):
        for p, dirs, files in walk(root, report['skipped'], report['errors']):
            is_git = (p / '.git').exists()
            # Parent is yielded before descent: stop discovery below any project.
            if is_git or MARKERS.intersection(files):
                info = stats(p)
                info.update(path=str(p), kind='git' if is_git else 'without_git',
                            deletion_ready=False)
                if is_git:
                    info['git'] = audit(p)
                    info['complete'] = info['complete'] and info['git']['complete']
                    info['latest_epoch'] = max(info['latest_epoch'],
                        info['git'].get('latest_commit_epoch', 0))
                    if info['git'].get('linked_git_metadata') or info['git'].get('worktree_count', 0) > 1:
                        info['complete'] = False
                age = (now - info['latest_epoch']) / DAY
                info['age_days'] = round(age, 2)
                info['last_observed_activity'] = stamp(info['latest_epoch'])
                info['inactive_candidate'] = bool(info['complete'] and age > args.project_days)
                report['projects'].append(info)
                dirs[:] = []
    for root in roots(args.video_root, report):
        for p, dirs, files in walk(root, report['skipped'], report['errors']):
            for name in files:
                item = p / name
                if item.suffix.lower() not in VIDEOS:
                    continue
                try:
                    st = item.lstat()
                    if not stat.S_ISREG(st.st_mode):
                        report['skipped'].append({'path': str(item), 'reason': 'not_regular'})
                        continue
                    if now - st.st_mtime > args.video_days * DAY:
                        report['videos'].append({'path': str(item), 'logical_bytes': st.st_size,
                            'modified_at': stamp(st.st_mtime), 'deletion_ready': False})
                except OSError as exc:
                    report['errors'].append({'path': str(item), 'error': type(exc).__name__})
    for root in roots(args.cache_root, report):
        try:
            for p in root.iterdir():
                info = stats(p)
                info.update(path=str(p), discardability='unverified', deletion_ready=False)
                report['caches'].append(info)
        except OSError as exc:
            report['errors'].append({'path': str(root), 'error': type(exc).__name__})
    for key in ('projects', 'videos', 'caches'):
        report[key].sort(key=lambda x: x['logical_bytes'], reverse=True)
    report['scan_has_errors'] = bool(report['errors'] or any(
        not x['complete'] for k in ('projects', 'caches') for x in report[k]))
    report['note'] = 'Triage only. Skipped paths and read-only usage require review. No deletion authorized.'
    return report


def positive(value):
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError('Must be a positive integer')
    return number


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    inventory = commands.add_parser('scan')
    for name in ('project', 'video', 'cache'):
        inventory.add_argument('--' + name + '-root', action='append', default=[])
    inventory.add_argument('--project-days', type=positive, default=14)
    inventory.add_argument('--video-days', type=positive, default=90)
    repo = commands.add_parser('git-audit')
    repo.add_argument('path')
    args = parser.parse_args()
    if args.command == 'scan' and not (args.project_root or args.video_root or args.cache_root):
        parser.error('Provide at least one explicit root')
    output = scan(args) if args.command == 'scan' else audit(args.path)
    print(json.dumps(output, indent=2, ensure_ascii=True))


if __name__ == '__main__':
    main()
