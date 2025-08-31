import { Plugin } from "vencord";

interface Badge {
  label: string;
  color?: string;
}

export default class StaffBadge extends Plugin {
  onStart() {
    console.log("[StaffBadge] started");
    this.patchUserBadges();
  }

  onStop() {
    console.log("[StaffBadge] stopped");
  }

  patchUserBadges() {
    // Find the UserBadge module
    const UserBadgeModule = this.findModule(m => m.default?.displayName === "UserBadge");
    if (!UserBadgeModule) return;

    const original = UserBadgeModule.default;

    UserBadgeModule.default = (props: any) => {
      const user = props.user;
      let badges: Badge[] = props.badges || [];

      // TODO: Replace these IDs with your server's user IDs
      if (user?.id === "OWNER_ID") badges.push({ label: "Owner", color: "#FF4500" });
      else if (user?.id === "ADMIN_ID") badges.push({ label: "Admin", color: "#1E90FF" });
      else if (user?.id === "MOD_ID") badges.push({ label: "Mod", color: "#32CD32" });

      return original({ ...props, badges });
    };
  }

  findModule(filter: (mod: any) => boolean) {
    const modules = Object.values(
      window.webpackChunkdiscord_app.push([[], {}, e => e.c])
    ).flatMap(m => Object.values(m));
    return modules.find(filter);
  }
}
