const search = (posts,string) => {
  return posts.filter(post => {
    if(string){
      return post.indexOf(string) !== -1
    } else {
      return post
    }
  })
}

module.exports = search
