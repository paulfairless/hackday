# hack.rb
  require 'rubygems'
  require 'sinatra'
  require 'httparty'
  require 'json'
  
  class SkyNews
    include HTTParty
  end
  
  helpers do
    def cleanNewsML(newsml)
      clean = {}
      stories = []
      
      newsml["NewsML"]["NewsItem"].each{|key, value|
        story = {}
        newsitem = key["NewsComponent"]["NewsComponent"]["NewsComponent"]
        
#        story["id"] = key["Identification"]["NewsIdentifier"]["NewsItemId"]
        story["headline"] = newsitem[0]["NewsLines"]["HeadLine"]
        story["slug"] = newsitem[0]["NewsLines"]["SlugLine"]
        story["body"] = newsitem[0]["ContentItem"]["DataContent"]
        
        imageIndex = newsitem[1]["ContentItem"].index{|item|item["Characteristics"]["Property"][0]["Value"]=='400'}
        if (imageIndex)
           story["image"] =  newsitem[1]["ContentItem"].at(imageIndex)["Href"]
        else
          story["image"] =  '/img/breaking-news.jpg'
        end

        # Do we have a video
        if newsitem.size() > 2
          videoWithPhoto = newsitem[2]["ContentItem"][0]
          video = ""
          if videoWithPhoto
            video = newsitem[2]["ContentItem"][0]["Href"]
            # story["image"] =  newsitem[2]["ContentItem"][1]["Href"]
          else
            video = newsitem[2]["ContentItem"]["Href"]
          end
          story["video"] = video
        end
        
        stories.push story
      }
      # puts stories.to_s
      clean["stories"] = stories
      return clean
    end
  end
  
  
  get '/' do
    'Hello world!'
  end
  
  
  get '/feed/:feed' do |f|
    callback = params.delete('callback')
    resp = HTTParty.get("http://news.sky.com/sky-news/newsml/#{f}/index.xml")
    json = resp.parsed_response.to_json
    json = cleanNewsML(resp.parsed_response).to_json
    if callback
      content_type :js
      response = "#{callback}(#{json})" 
    else
      content_type :json
      response = json
    end
    response
  end
  
  get '/blogs' do
    callback = params.delete('callback')
    resp = HTTParty.get("http://news.sky.com/sky-news/feeds/blogs/topBlogs.xml")
    json = resp.parsed_response.to_json
    if callback
      content_type :js
      response = "#{callback}(#{json})" 
    else
      content_type :json
      response = json
    end
    response
  end