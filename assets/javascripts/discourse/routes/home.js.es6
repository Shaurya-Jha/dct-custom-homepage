import DiscourseRoute from "discourse/routes/discourse";
import { ajax } from "discourse/lib/ajax";
import { end, scheduleOnce } from "@ember/runloop";
import RSVP from "rsvp";

function mapTopic(t) {
  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    unicodeTitle: t.unicode_title,
    likeCount: t.like_count,
    postsCount: t.posts_count ?? t.post_count,
    lastPostedAt: t.last_posted_at || t.bumped_at || t.created_at,
    url: t.slug ? `/t/${t.slug}/${t.id}` : `/t/${t.id}`,
    imageUrl: t.image_url || t.image,
  };
}

// Define these near the top of your route file (outside export default)
const CATEGORIES_TO_SHOW = [
  { key: "owner-reports", title: "Owner reports", slug: "owner-reports" },
  { key: "travelogues", title: "Travelogues", slug: "travelogues" },
  { key: "technical-stuff", title: "Technical stuff", slug: "technical-stuff" },
];

// fetch topics for a single category slug
function fetchCategoryTopics(slug, limit = 6) {
  return ajax(`/c/${slug}.json`).then((resp) => {
    const list =
      resp?.topic_list?.topics ||
      (Array.isArray(resp?.topic_list) ? resp.topic_list : null) ||
      resp?.topics ||
      resp?.category?.topic_list ||
      [];
    return (list || []).slice(0, limit);
  }).catch(() => []);
}

export default DiscourseRoute.extend({
    model(){
        return RSVP.hash({
            // top 5 monthly for carousel
            topics: ajax("/top.json", {
                data: {
                    period: "monthly",
                    per_page: 5
                }
            }).then((resp) => {
                const all = (resp?.topic_list?.topics || []).map(mapTopic);
                return all.filter((t) => !!t.imageUrl).slice(0, 5);
            }),

            // hot posts for the right side banner
            hotPosts: ajax("/hot.json", {
                data: {
                    per_page: 15
                }
            }).then((resp) => {
                const topics = resp?.topic_list?.topics || [];
                return topics.slice(0, 15).map(mapTopic)
            }),

            // categories with topics
            categories: RSVP.all(
                CATEGORIES_TO_SHOW.map((c) =>
                    fetchCategoryTopics(c.slug, 9).then((resp) => ({
                        ...c,
                        topics: resp.map(mapTopic).filter((t) => !!t.imageUrl),
                    }))
                )
            )
        });
    },

  setupController(controller, model) {
    this._super(controller, model);
    // wait until DOM is painted, then start
    scheduleOnce("afterRender", this, () => controller.startCarousel());
  },

  deactivate() {
    const c = this.controllerFor("home");
    if (c?.stopCarousel) c.stopCarousel();
    this._super(...arguments);
  },
});
