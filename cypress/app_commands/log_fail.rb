# This file is called when a cypress spec fails and allows for extra logging to be captured
filename_raw = command_options.fetch('runnable_full_title', 'no title').gsub(/[^[:print:]]/, '')
filename = ActiveStorage::Filename.new(filename_raw).sanitized

# grab last lines until "APPCLEANED" (Make sure in clean.rb to log the text "APPCLEANED")
system "tac log/#{Rails.env}.log | tail -n 10000 | sed \"/APPCLEANED/ q\" | sed 'x;1!H;$!d;x' > log/#{filename}.log"

# create a json debug file for server debugging
json_result = {}
json_result['error'] = command_options.fetch('error_message', 'no error message')

if defined?(ActiveRecord::Base)
  json_result['records'] =
    ActiveRecord::Base.descendants.each_with_object({}) do |record_class, records|
      begin
        records[record_class.to_s] = record_class.limit(100).map(&:attributes)
      rescue
      end
    end
end

filename_raw = command_options.fetch('runnable_full_title', 'no title').gsub(/[^[:print:]]/, '')
filename = ActiveStorage::Filename.new(filename_raw).sanitized
File.open("#{Rails.root}/log/#{filename}.json", "w+") do |file|
  file << JSON.pretty_generate(json_result)
end
