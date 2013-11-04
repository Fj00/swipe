#unless == if not
#until == while not
#if block inside control statement is one line, use the format "do this if that" to condense whole thing to one line
#use "array.each do |array item|" instead of "for array_item in array"

require 'anemone'

Anemone.crawl("http://www.forexfactory.com/") do |anemone|
  anemone.on_every_page do |page|
     puts page.url
  end
end

#print "hello world\n"