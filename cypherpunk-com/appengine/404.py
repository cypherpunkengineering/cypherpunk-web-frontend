#!/usr/bin/env python

# [START imports]
import os
import urllib
import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=False)
# [END imports]

# [START blog_post]
class FileNotFound(webapp2.RequestHandler):

	def get(self, postId):
		self.error(404)
		template = JINJA_ENVIRONMENT.get_template('404-template.html')
		self.response.write(template.render({}))
# [END blog_post]

# [START app]
app = webapp2.WSGIApplication([
	('.*', FileNotFound)
], debug=True)
# [END app]

# vim: softtabstop=0 noexpandtab ts=4 foldmethod=marker wrap
