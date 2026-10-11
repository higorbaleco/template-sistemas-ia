// Middleware to ensure organization context and prevent cross-org access

export function withOrgContext(handler: Function) {
  return async (req: any) => {
    const { orgId } = req.params;
    const userOrgId = req.user?.org_id;

    if (!orgId || orgId !== userOrgId) {
      return {
        status: 403,
        body: { error: 'Forbidden: Invalid organization context' },
      };
    }

    // Attach org context
    req.orgContext = {
      organizationId: orgId,
      userId: req.user?.sub,
      roles: req.user?.roles || [],
    };

    return handler(req);
  };
}
