
## Movie Grail (COMSM0104)
*Movie Grail* is a simple movie recommendation website designed by Haoyan CHEN (31288) and Weijia LIU (31012).
<div class="about_face">
    <img class="img-circle" src="/images/frank-n.png"  width="200" height="200">
    <img class="img-circle about_center" src="/images/ellie-n.png"  width="200" height="200">
</div>


### How to start up **Movie Grail**?

- Please execute `npm install` command in the root directory, and the node modules will be installed automatically.
- Then execute `node index.js` command in the root directory.
- Open a browser (perfectly Chrome) and access `http://localhost:3000`.
- Please click  [About Us](http://localhost:3000/about) link at the bottom or access `http://localhost:3000/about` directly to see the detail about this website.

### Summarize our achievement

|      Item     	| Self-assessment 	|                                                       Brief Notes (The detail is below)                                                      	|
|:-------------:	|:---------------:	|:--------------------------------------------------------------------------------------------------------------------------------------------	|
| HTML          	|        A        	| **Bootstrap** framework and **Handlebars** view engine are used to gengerate HTML pages.                                                             	|
| CSS           	|        A        	| CSS is applied to some animations and decoration of our web pages.                                                                            	|
| JS            	|        A        	| Many dynamic tips and operations are implemented by **AJAX** and JQuery.                                                                         	|
| PNG           	|        A        	| Use sophisticated techniques of **GIMP** to create fantastic images.                                                                            	|
| SVG           	|        A        	| Explore a wide range of techniques that **Inkscape** offers to draw vector graphics.                                                            	|
| Server        	|        A        	| **Express** -- Node js web application framework is used to build up this website. Compatibility test and security improvement are also considered. 	|
| Database      	|        A        	| **Sqlite3** is applied to storing the data and executing some complex queries, and **SQL injection problem** is considered in this website.          	|
| Dynamic pages 	|        A        	| **JQuery** and Handlebars view engine is used to implement a fluent dynamic experience.                                                          	|

### Implementation detail

1. #### HTML
    - **Bootstrap** and **Handlebars** view engine are used to generate HTML pages.
    - **`marked`** module is used to convert .md file to HTML code ([About Us](http://localhost:3000/about)).

2. #### CSS
    - **Bootstrap** default css is used to decorate the web pages.
    - Some animations (take changing buttons' color when the mouse hovers them for example) and modifying some elements' styles (like the search boxes at the top and in the home page) are implemented through css by ourselves.
	
3. #### JS
	- In order to implement dynamic pages and improve the users' experience, **Jquery AJAX** is applied to our website, which can respond to users' operations without reloading the web pages.
	- Many **Javascript** functions are implemented to provide users with a fluent experience, which could give them responses in time. For example, many friendly tips will be popped before submitting forms, and you can click the button or just type 'enter' key when searching a movie.
	- Illegal input characters will be forbidden when submitting a comment. 

4. #### PNG

	##### We made the face logo by getting galaxy effect from our faces. The techniques used are presented below.
	
	<div class="about_face">
		<img  src="/images/frank-n.png"  width="150" height="150">
		<img class="about_center" src="/images/ellie-n.png"  width="150" height="150">
	</div>
	
	- #### **Basic techniques**	
		- Convert images to PNG, crop images and change resolutions.
		- Change colors by adjusting color curves, adding filters and applying color threshold.
	- #### **Sophisticated techniques**	
		- Flexibly **handle layers** and **transparency**, such as merge down and add Alpha channel.
		- **Edit paths** to add galaxy effect of the regions with similar colors.
		- Flexibly use the **tool menu** such as free selected, scale, alignment, text and blend tool (fill the image with color gradients).

5. #### SVG

	##### For the logo of our website, we got the design inspiration from the internet and created it by ourselves using Inkscape. The techniques used are listed below.
	<div class="about_svg">
		<img  src="/images/LOGO_footer.png"  height="150">
		<img  class="about_center" src="/images/mdetail-info-bg.png"  height="150">
	</div>
	
	- #### **Basic techniques**
		- Draw simple icons, fill and change colors, adjust shape and transparency.
		- Flexibly draw Bezier curves and straight lines and edit paths by nodes.
	- #### **Advanced techniques**
		- Apply related Path and Text techniques to make the text "Movie Grail" follow a curve.
		- Edit objects by grouping, rotating, flipping and aligning.
		- Create glasses patterns that are infinitely repeated as backgrounds in our detail page.

6. #### Server
	- **Express** -- Node js web application framework is used to build up this website.
	- All the **URLs will be validated** before executing a specific GET / POST function.
	- Cookie was used to store login information at first, but **session** is applied to storing user information in the end because of the insecurity of cookies. Actually, in the real world, synchronization of session is a challenging task, which may be solved by Redis or other tools.
	- Basic **compatibility test** is tested on Chrome, IE 10 and FireFox browser.
	
7. #### Database
	- **Sqlite3** is applied to storing the data and executing some complex queries, like `LIKE`, `JOIN` and `AVG` .
	- In order to **prevent SQL injection**, all the parameters of CURD statements are replaced by placeholders rather than just using `concat()` to combine parameters with statements.
	- The structure of tables is simple and clear based on some general principles (such as BCNF).

8. #### Dynamic pages
	- As mentioned before, **JQuery, Javascript and Handlebars** view engine are used to create a fluent dynamic experience for our users. 
	- A lot of details have been tackled perfectly, such as different sorting order of recommended movies.
	
	
<br/>

##### [Download Report](http://localhost:3000/webtech-report.pdf)
	




















































 

































































































































































































































































































































































