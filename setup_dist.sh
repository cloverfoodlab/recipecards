echo "copying index into dist"
cp index.html dist

echo "creating api redirect"
rm _redirects
echo '/api/*  https://api.whentomanage.com/v1/accounts/2985/:splat?access_token='$PEACHWORKS_ACCESS_TOKEN' 200' >> _redirects
echo '/test/* https://owenwang.com/:splat 200' >> _redirects
echo '/foo /' >> _redirects
cp _redirects dist

