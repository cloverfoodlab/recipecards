echo "copying index into dist"
cp index.html dist

echo "creating api redirect"
rm _redirects
echo '/api/wtm_recipes  https://api.peachworks.com/v1/accounts/'$PEACHWORKS_ACCOUNT_ID'/wtm_recipes?access_token='$PEACHWORKS_ACCESS_TOKEN'  200' >> _redirects
echo '/test/*  http://owenwang.com/:splat  200' >> _redirects
echo '/foo  /' >> _redirects

echo "copying redirects and headers into dist"
cp _redirects dist
cp _headers dist

