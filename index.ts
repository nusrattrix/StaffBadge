import { Plugins } from "vencord";

interface Badge {
  label: string;
  color?: string;
}

export default class StaffBadge extends Plugins.Plugin {
  onStart() {
    console.log("[StaffBadge] started");
    this.patchUserBadges();
  }

  onStop() {
    console.log("[StaffBadge] stopped");
    Plugins.Patcher.unpatchAll();
  }

  patchUserBadges() {
    const UserBadgeModule = Plugins.WebpackModules.findByDisplayName("UserBadge");
    if (!UserBadgeModule) return;

    Plugins.Patcher.after(UserBadgeModule, "default", (_, [props], ret) => {
      const user = props.user;
      const badges: Badge[] = props.badges || [];

      if (user?.id === "OWNER_ID") badges.push({ label: "Owner", color: "#FF4500" });
      else if (user?.id === "ADMIN_ID") badges.push({ label: "Admin", color: "#1E90FF" });
      else if (user?.id === "MOD_ID") badges.push({ label: "Mod", color: "#32CD32" });

      props.badges = badges;
      return ret;
    });
  }
}
