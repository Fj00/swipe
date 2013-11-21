require 'nokogiri'
require 'open-uri'
=begin
#LA Times Blogs	
	link_and_title = []
	la_times = 	[
								"http://latimesblogs.latimes.com/technology/", 
								"http://latimesblogs.latimes.com/sports_blog/", 
								"http://latimesblogs.latimes.com/showtracker/",
								"http://latimesblogs.latimes.com/lanow/"
							]
	la_times.each do |link|
		html = Nokogiri::HTML( open( link ) )
		html.xpath( '//div[@class="curvedContent"]//td/*[2]/a' ).each do |a|
			link_and_title.push( [ "http://latimesblogs.latimes.com" + a['href'], a.text] )
		end
		puts link_and_title
	end

#NYT blogs
	blogs = [
						"http://bits.blogs.nytimes.com/2013/", 
						"http://well.blogs.nytimes.com/2013/", 
						"http://artsbeat.blogs.nytimes.com/2013/", 
						"http://cityroom.blogs.nytimes.com/2013/",
						"http://economix.blogs.nytimes.com/2013/",
						"http://parenting.blogs.nytimes.com/2013/",
						"http://kristof.blogs.nytimes.com/2013/",
						"http://opinionator.blogs.nytimes.com/2013/",
						"http://krugman.blogs.nytimes.com/2013/",
						"http://thecaucus.blogs.nytimes.com/2013/"	 
					]
	blogs.each do |b|
		html = Nokogiri::HTML( open( b ) ) and nil
		urls = []
		html.xpath( '//div[@id="content"]//h3/a' ).each do |a|
			title_and_link = a["href"], a.text
			urls.push [ title_and_link ]
		end
		puts urls
		puts urls.length
	end

#NYT main page
	xml = Nokogiri::XML( open( "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml" ) ) and nil
	mainURL = []
	xml.search( '//item//link | //item//title' ).each do |a|
		mainURL.push(a.text)
	end
	puts mainURL

#bloomberg
	html = Nokogiri::HTML( open( "http://www.bloomberg.com/archive/news/" ) ) and nil
	urls = []
	html.xpath( '//ul[@class="stories"]/li/a' ).each do |a|
		title_and_link = "http://www.bloomberg.com" + a["href"], a.text
		urls.push [ title_and_link ]
	end
	puts urls

#yahoo
	html = Nokogiri::HTML( open( "http://news.yahoo.com/archive/" ) ) and nil
	urls = []
	html.xpath( '//div[@id="MediaStoryList"]//h4/a' ).each do |a|
		#need to check for 'http'
		#if some already have full link, don't need to create a custom string
		unless a["href"].match(/http/)
			title_and_link = "http://news.yahoo.com/archive/" + a["href"], a.text
		else 
			title_and_link = a["href"], a.text.sub('[$$]', '') #some titles contain [$$] at the beginning
		end
		urls.push [ title_and_link ]
	end
	puts urls

#the loop
	html = Nokogiri::HTML( open( "http://www.loopinsight.com/2013/" ) )
	html.xpath( '//div[@class="container"]//h2/a' ).each do |a|
		puts a['href'], a.text
	end

#huff post
	html = Nokogiri::HTML( open( "http://www.huffingtonpost.com/" ) ) and nil
		urls = []
		html.xpath( '//div[@id="news_column"]//h4/a' ).each do |a|
			if a['href'].match(/#{Time.now.year}/) && a.text.length > 0
				title_and_link = a["href"], a.text
				urls.push [ title_and_link ]
			end
		end
		puts urls
		puts urls.length

#NYT front page

	html = Nokogiri::HTML( open( "http://www.nytimes.com/" ) ) and nil
			urls = []
			html.xpath( '//div[@class="abColumn"]//div[@class="story"]' ).each do |a|
				puts a.css('h2 a')
				puts a.css('h3 a')

			end
			puts urls
			puts urls.length

#NYT main page
	url =
	xml = Nokogiri::XML( open( "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml" ) ) and nil
	mainURL = []
	xml.search( '//item' ).each do |a|
		title_and_link = [a.css('link').text, a.css('title').text]
		mainURL.push(title_and_link)
	end
=end
	#puts mainURL
	url = "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
	xml = Nokogiri::XML( open( url ) )
	xml.search( '//item' ).each do |a|
	  buzz_url = a.css('link').text
	  buzz_title = a.css('title').text
	  if buzz_url.length > 0 && buzz_title.length > 0 
	  	puts "#{buzz_title} #{buzz_url}"
	  end
	end