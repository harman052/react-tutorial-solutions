let images = document.getElementsByTagName('img');
for(let i = 0; i < images.length; i++)
  images[i].setAttribute('hidden', true);
    


function myfunction()
{
  let images = document.getElementsByTagName('img');
  
  for(let i = 0; i < images.length; i++)
    images[i].setAttribute('hidden', true);
  let rand = Math.floor(Math.random()*images.length);
  images[rand].removeAttribute('hidden');
}