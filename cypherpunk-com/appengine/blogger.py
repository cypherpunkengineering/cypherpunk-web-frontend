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

import HTMLParser

import re

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=False)
# [END imports]

BLOGGER_API_KEY = 'AIzaSyBbjWAJoDWKxZ7R8DbIhf3mT595m1f5Tfs'
BLOGGER_BLOG_ID = '4561014629041381755'
BLOGGER_SUPPORT_ID = '2467816098254238300'

# [START blog_post]
class BlogPost(webapp2.RequestHandler):

	def get(self, postId):
		service = build('blogger', 'v3', developerKey=BLOGGER_API_KEY)

		posts = service.posts()
		request = posts.get(blogId=BLOGGER_BLOG_ID, postId=postId)
		post = request.execute()

		unescapedContent = HTMLParser.HTMLParser().unescape(post['content'])
		content = re.sub(r'CypherpunkDescription:.*<', r'<', unescapedContent)
		description = re.sub(r'.*CypherpunkDescription: (.*)<.*', r'\1', unescapedContent, flags=re.DOTALL)
		if '<' in description:
			description = post['title']

		template_values = {
			'__BLOG_TITLE__': post['title'],
			'__BLOG_DATE__': post['updated'],
			'__BLOG_DESCRIPTION__': description,
			'__BLOG_CONTENT__': content,
			'__BLOG_URL__': self.request.url,
			'__BLOG_IMAGE__': 'https://' + self.request.host + '/assets/features/masthead@2x.png'
		}

		template = JINJA_ENVIRONMENT.get_template('blog-article.html')
		self.response.write(template.render(template_values))
# [END blog_post]

# [START support_article]
class SupportArticle(webapp2.RequestHandler):

	def get(self, postId):
		service = build('blogger', 'v3', developerKey=BLOGGER_API_KEY)

		posts = service.posts()
		request = posts.get(blogId=BLOGGER_SUPPORT_ID, postId=postId)
		post = request.execute()

		unescapedContent = HTMLParser.HTMLParser().unescape(post['content'])
		content = re.sub(r'CypherpunkDescription:.*<', r'<', unescapedContent)
		description = re.sub(r'.*CypherpunkDescription: (.*)<.*', r'\1', unescapedContent, flags=re.DOTALL)
		if '<' in description:
			description = post['title']

		template_values = {
			'__SUPPORT_TITLE__': post['title'],
			'__SUPPORT_DATE__': post['updated'],
			'__SUPPORT_DESCRIPTION__': description,
			'__SUPPORT_CONTENT__': content,
			'__SUPPORT_URL__': self.request.url,
			'__SUPPORT_IMAGE__': 'https://' + self.request.host + '/assets/features/masthead@2x.png'
		}

		template = JINJA_ENVIRONMENT.get_template('support-article.html')
		self.response.write(template.render(template_values))
# [END support_article]

# [START support_tutorial]
class SupportTutorial(webapp2.RequestHandler):

	def get(self, postId):
		service = build('blogger', 'v3', developerKey=BLOGGER_API_KEY)

		posts = service.posts()
		request = posts.get(blogId=BLOGGER_SUPPORT_ID, postId=postId)
		post = request.execute()

		unescapedContent = HTMLParser.HTMLParser().unescape(post['content'])
		content = re.sub(r'CypherpunkDescription:.*<', r'<', unescapedContent)
		description = re.sub(r'.*CypherpunkDescription: (.*)<.*', r'\1', unescapedContent, flags=re.DOTALL)
		if '<' in description:
			description = post['title']

		template_values = {
			'__SUPPORT_TITLE__': post['title'],
			'__SUPPORT_DATE__': post['updated'],
			'__SUPPORT_DESCRIPTION__': description,
			'__SUPPORT_CONTENT__': content,
			'__SUPPORT_URL__': self.request.url,
			'__SUPPORT_IMAGE__': 'https://' + self.request.host + '/assets/features/masthead@2x.png'
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
