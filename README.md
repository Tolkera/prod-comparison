# What was done

- The products are fetched from the remote server.
- The differences between products are highlighted.
- You can show / hide products from the listing via checkboxes (the comparison is updated).
- You can remove products from the listing (if some products were hidden they stay in the listing as hidden). The comparison is updated.
- The page is responsive until 850px, below that the horizontal scroll is shown on the table block (not the whole page)
- IE11 support


# What was used

- ReactJS, ES6
- A modification of BEM for SCSS
- Gulp (babel) for compilation

# How to start

Open index.html in the browser for local version. You can see demo at https://i-compare-products.herokuapp.com/


# How to develop

`gulp watch` for watching dev changes and compilation. If you do that, React is compiled to DEV version (not production).
The compilation to production is set at Heroku or you can also run `gulp build` to get a production version locally.

