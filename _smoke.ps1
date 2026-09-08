$base = 'http://localhost:3001/api'
$reg = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body (@{username='admin'; email='admin@example.com'; password='password123'; password2='password123'} | ConvertTo-Json)
"REGISTER: user=$($reg.user.username)"
$headers = @{ Authorization = "Bearer $($reg.tokens.access)" }
$prod = Invoke-RestMethod -Uri "$base/products/" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{name='Rattan Basket'; category='Wall Art'; description='Handwoven'; price='45.00'; stock=10} | ConvertTo-Json)
"CREATE PRODUCT: id=$($prod.id) name=$($prod.name) stock=$($prod.stock)"
$sell = Invoke-RestMethod -Uri "$base/products/$($prod.id)/sell/" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{quantity=3} | ConvertTo-Json)
"SELL 3: newStock=$($sell.product.stock) saleTotal=$($sell.sale.total)"
$restock = Invoke-RestMethod -Uri "$base/products/$($prod.id)/restock/" -Method Post -Headers $headers -ContentType 'application/json' -Body (@{quantity=5} | ConvertTo-Json)
"RESTOCK 5: newStock=$($restock.stock)"
$sales = Invoke-RestMethod -Uri "$base/sales/" -Method Get
"SALES: count=$($sales.Count)"
$prof = Invoke-RestMethod -Uri "$base/auth/profile" -Method Get -Headers $headers
"PROFILE: $($prof.username) / $($prof.email)"
