require 'nokogiri'
require 'open-uri'

#LA Times Blogs	
	link_and_title = []
	la_times = ["http://latimesblogs.latimes.com/technology/", "http://latimesblogs.latimes.com/sports_blog/", "http://latimesblogs.latimes.com/showtracker/"]
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
	xml.search( '//item' ).each do |a|
		%w[link title].each do |n|
			puts a.at(n).text
		end
	end
	puts mainURL