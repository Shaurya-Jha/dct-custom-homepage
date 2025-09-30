# frozen_string_literal: true
# name: dct-custom-homepage
# about: simple /home + redirect /
# version: 0.0.1
# authors: You

# comment this out unless you actually created the setting in settings.yml
# enabled_site_setting :dct_custom_homepage_enabled

# Do NOT require a custom engine unless you need it.
# remove: require_relative "lib/dct_custom_homepage/engine"

after_initialize do

   # make sure ApplicationController is loaded
  require_dependency 'application_controller'
  module ::DctCustomHomepage
    class HomeController < ::ApplicationController
      # If your site is login-required and you want guests to see the page:
      # skip_before_action :ensure_logged_in, only: :index

      def index
        render html: "<h1>Welcome</h1><p>Served from /home</p>".html_safe
        # or: render layout: 'application', template: 'dct_custom_homepage/home/index'
      end

      def data
        # Example payload: some site stats + latest 5 topics
        # list = TopicQuery.new(current_user, per_page: 5).list_latest

        render_json_dump(
          greeting: "hi 👋",
          stats: {
            users: User.count,
            topics: Topic.count,
            posts: Post.count
          },
        )
      end
    end
  end

  # Add /home and redirect / -> /home (use prepend so it wins over Discourse's root)
  Discourse::Application.routes.prepend do
    get '/home' => 'dct_custom_homepage/home#index'
    get '/' => redirect('/home') # add status: 302/301 if you like
    get "/dct/home.json" => "dct_custom_homepage/home#data"
  end
end




















# # frozen_string_literal: true

# # name: dct-custom-homepage
# # about: TODO
# # meta_topic_id: TODO
# # version: 0.0.1
# # authors: Discourse
# # url: TODO
# # required_version: 2.7.0

# enabled_site_setting :dct_custom_homepage_enabled

# module ::DctCustomHomepage
#   PLUGIN_NAME = "dct-custom-homepage"
# end

# require_relative "lib/dct_custom_homepage/engine"

# after_initialize do
#   # Define /home and redirect / -> /home
#   Discourse::Application.routes.append do
#     # Serve your custom homepage at /home
#     get '/home' => 'dct_custom_homepage/home#index'

#     # Redirect the root path to /home
#     get '/' => redirect('/home') # use status: 301 for permanent
#   end
# end
