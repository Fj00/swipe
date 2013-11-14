#unless == if not
#until == while not
#if block inside control statement is one line, use the format "do this if that" to condense whole thing to one line
#use "array.each do |array item|" instead of "for array_item in array"

require 'nokogiri'
require 'open-uri'
=begin require 'anemone'

Anemone.crawl("http://www.hyperproof.com") do |anemone|
	#titles = []
  anemone.on_every_page do |page|
  	#if page.url.to_s.match(/2013-11-04/)
    	puts page.url
  	#end
  end
end

#print "hello world\n"


require 'net/http'

source = Net::HTTP.get('http://bloomberg.com', '/index.html')

print source


require 'open-uri'
require 'nokogiri'

#bloomberg
def extractor(link)
	html = Nokogiri::HTML( open( link ) ) and nil
	urls = Array.new
	html.xpath( '//ul[@class="stories"]/li/a' ).each do |a|
		title_and_link = "http://www.bloomberg.com" + a["href"], a.text
		urls.push [ "http://www.bloomberg.com" + a["href"], a.text ]
		puts title_and_link
	end
end

#extractor("http://www.bloomberg.com/archive/news/")

#yahoo
def extractor(link)
	html = Nokogiri::HTML( open( "http://news.yahoo.com/archive/" ) ) and nil
	urls = []
	html.xpath( '//div[@id="MediaStoryList"]//h4/a' ).each do |a|
		#need to check for 'http'
		#if some already have full link, don't need to create a custom string
		unless a["href"].match(/http/)
			title_and_link = "http://news.yahoo.com/archive/" + a["href"], a.text
		else 
			title_and_link = a["href"], a.text
		end
		urls.push [ title_and_link ]
	end
	puts urls
end
=end
#extractor("http://news.yahoo.com/archive/")

#require 'alexa' -- costs money

#client = Alexa::Client.new(access_key_id: "key", secret_access_key: "secret")
#url_info = client.url_info(url: "http://www.hyperproof.com/")
#puts url_info.rank

#sbnation
=begin
	html = Nokogiri::HTML( open( "http://www.sbnation.com/latest-news" ) ) and nil
	urls = Array.new
	html.xpath( '//div[@class="l-chunk"]//h3/a' ).each do |a|
		title_and_link = a["href"], a.text
		urls.push [ a["href"], a.text ]
		puts title_and_link

	end
	puts urls.length
	puts urls[0][1]

#NYT blogs
	require 'nokogiri'
	require 'open-uri'
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
		urls = Array.new
		html.xpath( '//div[@id="content"]//h3/a' ).each do |a|
			title_and_link = a["href"], a.text
			urls.push [ title_and_link ]
		end
		puts urls
		puts urls.length
	end
#NYT main page
	xml = Nokogiri::XML( open( "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml" ) ) and nil
	mainURL = Array.new
	xml.search( '//item' ).each do |a|
		%w[link title].each do |n|
			puts a.at(n).text
		end
	end
	puts mainURL

	#wikipedia
	require 'nokogiri'
	require 'open-uri'
	html = Nokogiri::HTML( open( "http://en.wikipedia.org/wiki/Portal:Featured_content" ) ) and nil
		#urls = Array.new
		html.search( 'div#mw-content-text table' )[2].css('tr')[3].css('td')[0].css('a').each do |a|
			puts a.text, "http://en.wikipedia.org" + a['href']
		end
			
		#puts urls
		#puts urls.length

	#la times
		require 'nokogiri'
		require 'open-uri'
		html = Nokogiri::HTML( open( "http://www.latimes.com/business/technology/" ) ) and nil
		#urls = Array.new
		puts html.xpath('//div[@id="section"]//div[@class="curvedTop"]')


	#cnn finance
		require 'nokogiri'
		require 'open-uri'
		html = Nokogiri::HTML( open( "http://finance.fortune.cnn.com/2013/" ) ) and nil
		#urls = Array.new
		html.xpath('//div[@id="cnnBody"]//h2/a').each do |a|
			puts a['href'], a.text
		end

	#brand eating
		html = Nokogiri::HTML( open( "http://www.brandeating.com/" ) ) and nil
		#urls = Array.new
		html.xpath('//div[@id="main-wrapper"]//h3/a').each do |a|
			puts a['href'], a.text
		end

	#serious eats
		html = Nokogiri::HTML( open( "http://www.seriouseats.com/" ) ) and nil
		#urls = Array.new
		html.xpath('//div[@id="posts"]//h2/a').each do |a|
			puts a['href'], a.text
		end
	#nfl.com news
		require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "http://www.nfl.com/rss/rsslanding?searchString=home" ) )
		xml.search( '//entry' ).each do |a|
			puts a.css('title').text
			puts a.css('link').attr('href')
		end
		#urls = Array.new

	#mlb.com news
		require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "http://www.mlb.com/news/" ) )
		xml.search( '//div[@class="np_container"]//h2/a' ).each do |a|
			puts a['href'], a.text
		end
		#urls = Array.new

	#golf channel
		require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "http://www.golfchannel.com/news" ) )
		xml.xpath( '//div[@class="center-wrapper"]//div[@class="field-content views-field-title"]/a' ).each do |a|
			puts "http://www.golfchannel.com/news" + a['href'], a.text
		end

	#techmamas
	require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "http://techmamas.com/main/2013" ) )
		xml.xpath( '//div[@id="contentmain"]//h1/a' ).each do |a|
			puts a['href'], a.text
		end




	#the loop
		require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "http://www.loopinsight.com/2013/" ) )
		xml.xpath( '//div[@class="container"]//h2/a' ).each do |a|
			puts a['href'], a.text
		end

		require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "http://www.calculatedriskblog.com/2013" ) )
		xml.xpath( '//div[@class="blog-posts hfeed"]//h3/a' ).each do |a|
			puts a['href'], a.text
		end

	#consumer reports - not working
		require 'nokogiri'
		require 'open-uri'
		xml = Nokogiri::HTML( open( "simplefeed.consumerreports.org/f/100001s37j59do52okz.rss" ) )
		xml.search( '//item' ).each do |a|
			%w[link title].each do |n|
				puts a.at(n).text
			end
		end


	#daily galaxy
		require 'nokogiri'
		require 'open-uri'
		link_and_title = []
		xml = Nokogiri::HTML( open( "http://www.dailygalaxy.com/" ) )
		xml.xpath( '//div[@id="alpha-inner"]//h3/a' ).each do |a|
			link_and_title.push( [ a['href'], a.text ] )
		end
		puts link_and_title


		link_and_title = []
		xml = Nokogiri::HTML( open( "http://www.eater.com/" ) )
		xml.xpath( '//div[@class="column-content"]//div[@class="post post-boxed post-plain"]/h1/a' ).each do |a|
			link_and_title.push( [ a['href'], a.text ] )
		end
		puts link_and_title
=end
		link_and_title = []
		xml = Nokogiri::HTML( open( "http://www.foodandwine.com/blogs" ) )
		xml.xpath( '//div[@class="entry-excerpt"]//h2/a' ).each do |a|
			link_and_title.push( [ "http://www.foodandwine.com" + a['href'], a.text ] )
		end
		puts link_and_title




=begin
	# well
	html = Nokogiri::HTML( open( "http://well.blogs.nytimes.com/2013" ) ) and nil
	urls = Array.new
	html.xpath( '//div[@id="content"]//h3/a' ).each do |a|
		title_and_link = a["href"], a.text
		urls.push [ title_and_link ]
	end
	puts urls
	puts urls.length

	# arts beat .. only first page
	html = Nokogiri::HTML( open( "http://artsbeat.blogs.nytimes.com/2013/" ) ) and nil
	urls = Array.new
	html.xpath( '//div[@id="content"]//h3/a' ).each do |a|
		title_and_link = a["href"], a.text
		urls.push [ title_and_link ]
	end
	puts urls
	puts urls.length
	#puts urls[0][1]


#deep links
	html = Nokogiri::HTML( open( "https://www.eff.org/deeplinks") ) and nil
	urls = Array.new
	html.xpath( '//div[@class="view-content"]//h2/a' ).each do |a|
		title_and_link = a["href"], a.text
		urls.push [ title_and_link ]	
	end
	puts urls
	puts urls.length

#felix salmon
	html = Nokogiri::HTML( open( "http://blogs.reuters.com/felix-salmon/2013/") ) and nil
	urls = Array.new
	html.xpath( '//div[@class="topStory"]//h2/a' ).each do |a|
		title_and_link = a["href"], a.text
		urls.push [ title_and_link ]
	end
	puts urls
	puts urls.length
=end
=begin
require 'simple-rss'
rss = SimpleRSS.parse open('http://feeds.feedburner.com/20-nothings')
rss.items.each do |a|
	puts "#{a.link}","#{a.title}"
end
#links from 20-nothings
xml = Nokogiri::HTML( open ('http://feeds.feedburner.com/20-nothings') )
xml.xpath('//entry/link[@rel="alternate"]').each do |a|
	unless xml.xpath('//a[href]').to_s.match(/comment/)
		puts a["href"]
	end
end
=end
#puts rss.items.each do 
=begin -- return body html without script tags
	doc = html
	doc.at('body').search('script,noscript').remove
=end