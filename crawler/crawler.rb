#unless == if not
#until == while not
#if block inside control statement is one line, use the format "do this if that" to condense whole thing to one line
#use "array.each do |array item|" instead of "for array_item in array"

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
=end

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

extractor("http://news.yahoo.com/archive/")

#food.com
=begin def extractor(link)
	html = Nokogiri::HTML( open( link ) ) and nil
	#urls = Array.new
	html.xpath( '//div[@class="rz-topic-list"]//div/div/*[1]//descendant/a' ).each do |a|
		#title_and_link = "http://www.bloomberg.com" + a["href"], a.text
		#urls.push [ "http://www.bloomberg.com" + a["href"], a.text ]
		puts a.text
	end
end

extractor("http://www.food.com/recipes-popular")
=end