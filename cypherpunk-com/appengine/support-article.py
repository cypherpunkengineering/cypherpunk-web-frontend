#!/usr/bin/env python

# [START imports]
import os
import urllib
import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

# [START main_page]
class MainPage(webapp2.RequestHandler):

    def get(self, postId):
        template_values = {
            '__SUPPORT_TITLE__': 'foo',
            '__SUPPORT_DATE__': 'foo',
            '__SUPPORT_CONTENT__': 'foo',
            '__SUPPORT_URL__': 'foo',
            '__SUPPORT_IMAGE__': 'https://cypherpunk.com/assets/features/masthead@2x.png'
        }

        template = JINJA_ENVIRONMENT.get_template('support-article.html')
        self.response.write(template.render(template_values))
# [END main_page]

# [START app]
app = webapp2.WSGIApplication([
    ('/support/articles/([0-9]+)', MainPage),
], debug=True)
# [END app]
