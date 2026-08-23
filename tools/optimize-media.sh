#!/bin/bash
# Régénère les médias servis (photos/ clips/ audio/) depuis les originaux
# (images/ sounds/ videos/). Nécessite ffmpeg. Seuls les dérivés sont déployés.
set -u
ROOT="$(cd "$(dirname "$0")/../src/assets" && pwd)"
SRC_IMG=$ROOT/images; SRC_VID=$ROOT/videos; SRC_SND=$ROOT/sounds
OUT_IMG=$ROOT/photos; OUT_VID=$ROOT/clips; OUT_SND=$ROOT/audio
mkdir -p "$OUT_IMG" "$OUT_VID" "$OUT_SND"

# --- Avatars : <source>|<id> -> id.webp (1000px) + id-sm.webp (400px)
AVATARS="papa_an.PNG|an maman_ly.png|ly binh.jpg|binh kim.jpg|kim yaya.JPG|aikaterini maman.JPG|tina Laura.JPG|laura linh.PNG|linh nam.JPG|nam loan.JPG|loan tao.PNG|tao eric.jpeg|eric edouard2.jpg|edouard papou.jpeg|achille"
for pair in $AVATARS; do
  f=${pair%%|*}; id=${pair##*|}
  [ -f "$SRC_IMG/$f" ] || { echo "MANQUE $f"; continue; }
  ffmpeg -v error -y -i "$SRC_IMG/$f" -vf "scale='min(1000,iw)':-2" -quality 80 "$OUT_IMG/$id.webp"
  ffmpeg -v error -y -i "$SRC_IMG/$f" -vf "scale='min(400,iw)':-2"  -quality 82 "$OUT_IMG/$id-sm.webp"
done
echo "AVATARS OK"

# --- Photos de galerie : *_modal*.* -> <basename minuscule>.webp (1400px)
# maman_modal1 existe en .jpeg et .jpg : on force le .jpeg, seul référencé.
for f in "$SRC_IMG"/*_modal*; do
  [ -f "$f" ] || continue
  b=$(basename "$f"); b=${b%.*}
  [ "$(basename "$f")" = "maman_modal1.jpg" ] && continue
  low=$(echo "$b" | tr 'A-Z' 'a-z')
  ffmpeg -v error -y -i "$f" -vf "scale='min(1400,iw)':-2" -quality 78 "$OUT_IMG/$low.webp"
  # Variante intermédiaire servie aux petites vignettes via srcset.
  ffmpeg -v error -y -i "$f" -vf "scale='min(700,iw)':-2" -quality 76 "$OUT_IMG/$low-md.webp"
done
echo "GALERIES OK"

# --- Sons utilisés -> 64 kbps mono : ce sont des fonds sonores en boucle.
for s in dance_me_to_the_end_of_love non_je_ne_regrette_rien asimbonanga kokiri_forest vietnamese_music1 petit_papa_noel kung_fu_fighting vietnamese_music2 rendez_vous_dans_10_ans cheval_de_bois_adult to_gelakaki let_it_be_beatles mysterieuses_cites_dor dragon_ball_z tao_tao; do
  [ -f "$SRC_SND/$s.mp3" ] || { echo "MANQUE $s.mp3"; continue; }
  ffmpeg -v error -y -i "$SRC_SND/$s.mp3" -c:a libmp3lame -b:a 64k -ac 1 "$OUT_SND/$s.mp3"
done
echo "AUDIO OK"

# --- Vidéos utilisées -> 720p H.264 + poster webp
for v in papa edouard eric1 eric2 maman_ly1 maman_ly2 papa_an papa_an2 papou1 papou2 yaya2 yaya3; do
  [ -f "$SRC_VID/$v.mp4" ] || { echo "MANQUE $v.mp4"; continue; }
  ffmpeg -v error -y -i "$SRC_VID/$v.mp4" \
    -vf "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'" \
    -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 96k "$OUT_VID/$v.mp4"
  ffmpeg -v error -y -ss 1 -i "$OUT_VID/$v.mp4" -frames:v 1 -quality 72 "$OUT_VID/$v.webp"
done
echo "VIDEOS OK"
echo "=== TERMINE ==="
du -sh "$OUT_IMG" "$OUT_SND" "$OUT_VID"
