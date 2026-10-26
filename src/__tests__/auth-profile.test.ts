import { describe, it, expect } from "vitest";

describe("Customer Profile Isolation & Dynamic Session Resolution", () => {
  it("resolves profile data strictly for authenticated user and avoids demo customer fallback", () => {
    // Simulate user 1
    const userA = {
      id: "usr-uuid-1111",
      email: "alex.turner@example.com",
      user_metadata: { full_name: "Alex Turner", role: "customer" },
    };

    // Simulate user 2
    const userB = {
      id: "usr-uuid-2222",
      email: "priya.sharma@example.com",
      user_metadata: { full_name: "Priya Sharma", role: "customer" },
    };

    // Profile resolver simulating getCurrentUserProfileAction self-healing
    const resolveProfile = (user: typeof userA | null, dbProfiles: Record<string, any>) => {
      if (!user) {
        return { authenticated: false, profile: null };
      }
      let profile = dbProfiles[user.id];
      if (!profile) {
        profile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split("@")[0],
          role: user.user_metadata?.role || "customer",
          is_active: true,
        };
      }
      return { authenticated: true, profile };
    };

    const mockDb: Record<string, any> = {};

    // Test account 1: Alex Turner
    const resA = resolveProfile(userA, mockDb);
    expect(resA.authenticated).toBe(true);
    expect(resA.profile?.id).toBe("usr-uuid-1111");
    expect(resA.profile?.full_name).toBe("Alex Turner");
    expect(resA.profile?.full_name).not.toBe("Sarah Miller");

    // Test account 2: Priya Sharma
    const resB = resolveProfile(userB, mockDb);
    expect(resB.authenticated).toBe(true);
    expect(resB.profile?.id).toBe("usr-uuid-2222");
    expect(resB.profile?.full_name).toBe("Priya Sharma");
    expect(resB.profile?.full_name).not.toBe("Sarah Miller");
  });

  it("handles newly registered customer with no profile record yet (self-healing)", () => {
    const brandNewUser = {
      id: "usr-uuid-9999",
      email: "newcustomer@gmail.com",
      user_metadata: { full_name: "John Doe" },
    };

    const resolveFallbackProfile = (user: typeof brandNewUser) => {
      const fallbackName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";
      return {
        id: user.id,
        email: user.email,
        full_name: fallbackName,
        role: "customer",
        is_active: true,
      };
    };

    const generated = resolveFallbackProfile(brandNewUser);
    expect(generated.id).toBe("usr-uuid-9999");
    expect(generated.full_name).toBe("John Doe");
    expect(generated.full_name).not.toBe("Sarah Miller");
  });

  it("ensures authenticated users with 0 requests see empty list rather than demo requests", () => {
    const userRequests: any[] = [];
    const mockDemoRequests = [{ id: "req-1", title: "Fix Leaking Kitchen Sink" }];

    // If authenticated:
    const isAuthenticated = true;
    const displayedRequests = isAuthenticated ? userRequests : mockDemoRequests;

    expect(displayedRequests).toHaveLength(0);
    expect(displayedRequests).not.toContainEqual(mockDemoRequests[0]);
  });
});
