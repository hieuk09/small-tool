#!/usr/bin/env ruby
require 'rubygems'
require 'json'
require 'debugger'

class Converter
  def self.convert(json)
    hash = JSON.parse(json)
    string = "link: #{hash['actions'].first['link']}" if hash['actions'] != nil
    name = hash['from']['name'] if hash['from'] != nil
    string = "#{string}\n#{name}: #{hash['subject']}"
    string = "#{string}\n#{hash['message']}"
  end
end

if ARGV.size > 2 || ARGV.size < 2
  puts "Uncorrect format!!!"
  puts "Correct command: json-to-text.rb input output"
  abort
end

input = ARGV[0]
output = ARGV[1]

input = Dir[input]

input.each do |file|
  string = ""
  File.open(file, 'r') do |infile|
    begin
      while(line = infile.gets)
        string = Converter.convert(line)
      end
    rescue => e
      puts e.message
      puts file
    end
  end

  path = File.join(output, "#{File.basename(file, File.extname(file))}.txt")
  File.open(path, 'w') do |outfile|
    outfile.write(string)
  end
end
