S3 Autoindex
============

This HTML file uses the AWS JavaScript SDK to list files in a bucket. The goal is to make this
a reasonably full-featured JS app, installable by dropping a single file in a bucket.

Configuration of the bucket and creation of a Read-Only S3 access key require the following
configurations and policies.

Web Bucket Policy
-----------------
First a web-accessible S3 bucket must be created, and the following bucket policy added:

```
{
	"Version": "2008-10-17",
	"Statement": [
		{
			"Sid": "PublicReadGetObject",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::bucket.example.com/*"
		}
	]
}
```

Web Bucket CORS Configuration
-----------------------------

This is probably not necessary, since it's assumed the SDK will be running from the
same bucket that's being viewed, but:

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

S3 (IAM) User Policy
-------------------------

A new policy is used to grant the index file the rights to list the bucket:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::bucket.example.com"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::bucket.example.com/*"
            ]
        }
    ]
}
```
