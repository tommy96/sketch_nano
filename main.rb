require 'sinatra'
require 'sqlite3'
require 'sinatra/json'
require 'data_uri'
require 'securerandom'
require 'logger'

logger = Logger.new(STDOUT)

# DBの生成
db = SQLite3::Database.new 'db/post.db'
db.results_as_hash = true

get '/' do
  erb :index
end

get '/dashboard' do
  adult = params['adult']
  if adult == "true"
    posts = db.execute("SELECT * FROM pictures ORDER BY id DESC")
  else
    posts = db.execute("SELECT * FROM pictures WHERE eroi = 0 ORDER BY id DESC")
  end
  erb :dashboard, {:locals => {:posts => posts, :adult => adult}}
end

post '/dashboard' do
  sql = "UPDATE pictures SET likes = ('#{params['likes']}') WHERE ID = #{params['id']}"
  db.execute_batch(sql)

  redirect '/dashboard'
end

get '/draw' do
  erb :draw
end

post '/draw' do
  datauri = params['src']
  img = URI::Data.new(datauri).data

  # ファイル名をつける
  name = SecureRandom.hex + '.png'

  # 画像を保存
  File.open("./public/uploads/" + name, "wb") do |file|
    file.write img
  end

  # DBに登録する
  time = Time.now.strftime('%Y-%m-%d %H:%M:%S')
  sql = "INSERT INTO pictures (title, src, eroi, posted_at) VALUES ('#{params['title']}', '#{name}', '#{params['eroi']}', '#{time}')"
  db.execute_batch(sql)

  # 終わったらダッシュボードに戻る
  redirect '/dashboard'
end

get '/api/like' do
end
