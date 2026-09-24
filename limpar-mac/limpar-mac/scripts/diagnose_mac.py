#!/usr/bin/env python3
"""Measure local disk usage and Docker disk allocation; never delete or start services."""
import argparse
import json
import os
from pathlib import Path
import platform
import shutil
import stat
import sys


def inspect_disk_file(path):
    path = Path(os.path.abspath(os.path.expanduser(str(path))))
    result = {'path': str(path), 'deletion_ready': False}
    try:
        if path.resolve(strict=True) != path:
            raise ValueError('Symlink component: inspect the real path explicitly')
        metadata = path.lstat()
        if not stat.S_ISREG(metadata.st_mode):
            raise ValueError('Not a regular file')
        result.update(status='measured', logical_bytes=metadata.st_size,
                      allocated_bytes=metadata.st_blocks * 512,
                      logical_gib=round(metadata.st_size / 2**30, 2),
                      allocated_gib=round(metadata.st_blocks * 512 / 2**30, 2))
    except FileNotFoundError:
        result['status'] = 'not_found'
    except (OSError, ValueError, RuntimeError) as exc:
        result.update(status='unavailable', error=type(exc).__name__)
    return result


def snapshot(home, explicit_files=()):
    home = Path(home).resolve(strict=True)
    usage = shutil.disk_usage(home)
    default = home / 'Library/Containers/com.docker.docker/Data/vms/0'
    candidates = [default / 'data/Docker.raw', default / 'Docker.raw',
                  default / 'data/Docker.qcow2', default / 'Docker.qcow2']
    candidates.extend(Path(p).expanduser().absolute() for p in explicit_files)
    return {
        'system': platform.system(), 'machine': platform.node(),
        'measured_volume_path': str(home),
        'capacity_bytes': usage.total, 'free_bytes': usage.free,
        'free_gib': round(usage.free / 2**30, 2),
        'docker_disks': [inspect_disk_file(p) for p in dict.fromkeys(candidates)],
        'docker_daemon_contacted': False, 'changes_made': False,
        'note': 'Logical capacity and allocated space are different. Neither proves reclaimable space. Missing default paths do not rule out a custom Docker location.'
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--docker-file', action='append', default=[])
    args = parser.parse_args()
    if platform.system() != 'Darwin':
        print('Execute este diagnóstico no terminal do seu Mac. Este ambiente não é macOS.', file=sys.stderr)
        return 2
    try:
        result = snapshot(Path.home(), args.docker_file)
    except (OSError, RuntimeError) as exc:
        print('Não foi possível medir o volume local: ' + type(exc).__name__, file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
