# frozen_string_literal: true

DctCustomHomepage::Engine.routes.draw do
  get "/examples" => "examples#index"
  # define routes here
end

Discourse::Application.routes.draw { mount ::DctCustomHomepage::Engine, at: "dct-custom-homepage" }
