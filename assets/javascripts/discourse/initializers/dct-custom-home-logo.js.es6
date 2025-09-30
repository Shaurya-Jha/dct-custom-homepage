import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dct-home-logo-redirect",

  initialize(owner) {
    withPluginApi("0.8.7", (api) => {
      const router = owner.lookup("router:main");

      api.onPageChange(() => {
        // Discourse renders one of these selectors for the home link/logo
        const el =
          document.querySelector("a.home-link") ||
          document.querySelector("#site-logo");

        if (!el || el.dataset.dctHomeBound) return;
        el.dataset.dctHomeBound = "1";

        el.addEventListener("click", (e) => {
          e.preventDefault();
          router.transitionTo("home");
        });
      });
    });
  },
};
