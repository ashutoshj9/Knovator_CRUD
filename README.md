# Knovator_CRUD
Follow below command to run:
~ npm install
~ npm start

#  For Registering user send POST request on Postman to "http://localhost:3000/api/auth/register" 
- JSON FORMAT
- { "username": "name", "password": "password"}

# For Login user send POST request to "http://localhost:3000/api/auth/login"
- JSON FORMAT will be same as above.
- It will give token in response which we can use to access data of particular user by which we had logged in.

# Now, we can Add, Delete, Update, View our Post using that token which generated after login
# To Add Post, send POST request to "http://localhost:3000/api/posts", also add Authorization as Bearer "tokenID"
- JSON Format
- {
    "title": "title",
    "body": "Content",
    "latitude": 17.7749,
    "longitude": -102.4194
}

# To Get Posts, send GET request to "http://localhost:3000/api/posts", also add Authorization as Bearer "tokenID"
# To Get Specific Post, send GET request with postID to "http://localhost:3000/api/posts/{postID}", also add Authorization as Bearer "tokenID"
# To Delete Specific Post, send DELETE request with postID to "http://localhost:3000/api/posts/{postID}", also add Authorization as Bearer "tokenID"
# To Update Specific Post, send PUT request with postID to "http://localhost:3000/api/posts/{postID}", also add Authorization as Bearer "tokenID"
- and for Update add JSON FORMAT
- {
  "title": "Updated Post",
  "body": "Updated post content",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "active": false
}

# For Checking Count of active and inactive post on Dashboard, send GET request to "http://localhost:3000/api/posts/dashboard/count", also add Authorization as Bearer "tokenID"

# END

~ THANK YOU
