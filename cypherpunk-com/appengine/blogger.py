#!/usr/bin/env python

# [START imports]
import os
import urllib
import jinja2
import webapp2

import sys

from google.appengine.ext import vendor
vendor.add('lib')

from oauth2client import client
from apiclient.discovery import build

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)
# [END imports]

# [START blog_post]
class BlogPost(webapp2.RequestHandler):

	def get(self, postId):
		service = build('blogger', 'v3', developerKey='AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs')

		posts = service.posts()
		request = posts.get(blogId='4561014629041381755', postId=postId)
		post = request.execute()

		template_values = {
			'__BLOG_TITLE__': post['title'],
			'__BLOG_DATE__': post['updated'],
			'__BLOG_DESCRIPTION__': 'description goes here',
			'__BLOG_CONTENT__': post['content'],
			'__BLOG_URL__': post['url'],
			'__BLOG_IMAGE__': 'https://cypherpunk.com/assets/features/masthead@2x.png'
		}

		template = JINJA_ENVIRONMENT.get_template('blog-article.html')
		self.response.write(template.render(template_values))
# [END blog_post]

# [START support_article]
class SupportArticle(webapp2.RequestHandler):

	def get(self, postId):
		service = build('blogger', 'v3', developerKey='AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs')

		posts = service.posts()
		request = posts.get(blogId='2467816098254238300', postId=postId)
		post = request.execute()

		template_values = {
			'__SUPPORT_TITLE__': post['title'],
			'__SUPPORT_DATE__': post['updated'],
			'__SUPPORT_DESCRIPTION__': 'description goes here',
			'__SUPPORT_CONTENT__': post['content'],
			'__SUPPORT_URL__': post['url'],
			'__SUPPORT_IMAGE__': 'https://cypherpunk.com/assets/features/masthead@2x.png'
		}

		template = JINJA_ENVIRONMENT.get_template('support-article.html')
		self.response.write(template.render(template_values))
# [END support_article]

# [START support_tutorial]
class SupportTutorial(webapp2.RequestHandler):

	def get(self, postId):
		service = build('blogger', 'v3', developerKey='AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs')

		posts = service.posts()
		request = posts.get(blogId='2467816098254238300', postId=postId)
		post = request.execute()

		template_values = {
			'__SUPPORT_TITLE__': post['title'],
			'__SUPPORT_DATE__': post['updated'],
			'__SUPPORT_DESCRIPTION__': 'description goes here',
			'__SUPPORT_CONTENT__': post['content'],
			'__SUPPORT_URL__': post['url'],
			'__SUPPORT_IMAGE__': 'https://cypherpunk.com/assets/features/masthead@2x.png'
		}

		template = JINJA_ENVIRONMENT.get_template('support-tutorial.html')
		self.response.write(template.render(template_values))
# [END support_tutorial]

# [START app]
app = webapp2.WSGIApplication([
	('/support/articles/([0-9]+)', SupportArticle),
	('/support/articles/([0-9]+)/.*', SupportArticle),
	('/support/tutorials/([0-9]+)', SupportTutorial),
	('/support/tutorials/([0-9]+)/.*', SupportTutorial),
	('/blog/post/([0-9]+)', BlogPost),
], debug=True)
# [END app]

# vim: softtabstop=0 noexpandtab ts=4 foldmethod=marker wrap
