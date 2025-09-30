import Controller from "@ember/controller";
import { computed, observer } from "@ember/object";

export default Controller.extend({
  _carouselTimer: null,
  _carouselIndex: 0,

  // currently selected tab's key
  selectedCategory: 0,

  // convenience: the selected category object (falls back to first)
  selectedCat: computed("model.categories.[]", "selectedCategory", function () {
    const cats = this.get("model.categories") || [];
    if (!cats.length) return null;
    const key = this.get("selectedCategory") || cats[0].key;
    return cats.find((c) => c.key === key) || cats[0];
  }),

  _setDefaultCategoryOnce: observer("model.categories.[]", function () {
    if (this.get("selectedCategory")) return;
    const cats = this.get("model.categories") || [];
    if (cats.length) {
      this.set("selectedCategory", cats[0].key);
    }
  }),

  actions: {
    selectCategory(key) {
      this.set("selectedCategory", key);
    },
  },

  startCarousel() {
    const track = document.getElementById("carousel-track");
    if (!track) return;

    const slides = Array.from(track.children);
    const total = slides.length || 0;
    if (total <= 1) return; // nothing to slide

    // reset position in case of re-entry
    this._carouselIndex = 0;
    track.style.transform = "translateX(0%)";

    if (this._carouselTimer) {
      clearInterval(this._carouselTimer);
      this._carouselTimer = null;
    }

    this._carouselTimer = setInterval(() => {
      this._carouselIndex = (this._carouselIndex + 1) % total;
      const offsetPct = -this._carouselIndex * 100;
      track.style.transform = `translateX(${offsetPct}%)`;
    }, 3500); // 2 seconds
  },

  stopCarousel() {
    if (this._carouselTimer) {
      clearInterval(this._carouselTimer);
      this._carouselTimer = null;
    }
  },

  willDestroy() {
    this.stopCarousel();
    this._super(...arguments);
  },
});
