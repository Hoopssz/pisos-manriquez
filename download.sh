#!/bin/zsh
# Descarga los recursos visuales del sitio original
B="https://pisosmanriquez.cl/cdn/shop"
cd "$(dirname "$0")/img"
dl() { curl -sfL --max-time 40 "$2?width=${3:-1200}" -o "$1" && echo "OK $1" || echo "FAIL $1"; }

dl logo.png "$B/files/LOGO.PISOSMANRIQUEZ.png" 600
dl cat-flotantes.jpg "$B/collections/pm-cat-flotantes.jpg" 900
dl cat-vinilicos.jpg "$B/collections/pm-cat-vinilicos.jpg" 900
dl cat-ceramico.jpg "$B/collections/pm-cat-ceramico.jpg" 900
dl cat-papelmural.jpg "$B/collections/pm-cat-papelmural.jpg" 900
dl cat-pasto.jpg "$B/collections/pm-cat-pasto.jpg" 900
dl cat-ingenieria.jpg "$B/collections/pm-cat-ingenieria.jpg" 900
dl cat-alfombras.jpg "$B/collections/af6971ff-4d66-4583-b1dc-aeca4e402e7a.jpg" 900
dl cat-cortinas.jpg "$B/collections/pm-cat-cortinas.jpg" 900
dl hero-pasto.jpg "$B/files/pm-oferta-pasto-sintetico.jpg" 2000
dl hero-flotante.jpg "$B/files/pm-oferta-piso-flotante.jpg" 2000
dl hero-spc.jpg "$B/files/pm-oferta-piso-spc.jpg" 2000

i=1
for id in 895f3ee2-8d4e-42a3-86b5-d1a3bcd119cd 4e3846a5-7ecb-48cd-85b2-001da994a209 92062cdd-edcb-4824-b96c-99c52b7b0e1a 84d64974-57df-4ad2-8554-d66fbf77370f 29a9c238-efa3-4d16-92af-a07362207e1a c571a4ce-ae37-4b7e-8fdb-781beb025e4b bc13aed1-2324-4bca-835d-417bb9d891c2 1ccde10b-28eb-4d18-a6f8-389651bbd83f 4d31ddfe-52e9-4a45-9795-1868116e4c10 74c73cbe-0dca-4243-8362-8279e47b08a0 ad08d530-6785-43d2-9aad-255282e2eaf0 80412d96-b109-4fb0-8825-e34abe7669b2 ed4284da-0fb6-4ce0-bd7c-747aa3cc88c4; do
  dl products/p$i.jpg "$B/files/$id.jpg" 600
  i=$((i+1))
done

for b in carpenter bs-chile feltrex etersol pyramid multicarpet grupo-revex; do
  dl brands/$b.png "$B/t/10/assets/pmlogo-$b.png" 400
done
