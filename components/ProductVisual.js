export default function ProductVisual({product,large=false}){
 const secondary=!large&&product.images?.find(image=>image.url&&image.url!==product.image);
 return <div className={`product-stage ${secondary?'has-secondary':''} ${large?'large':''}`}>
  {product.image?<>
   <img className="product-photo product-photo-primary" src={product.image} alt={product.imageAlt||`${product.brand} ${product.name} ${product.size}`} width={large?900:500} height={large?900:500} loading={large?'eager':'lazy'}/>
   {secondary&&<img className="product-photo product-photo-secondary" src={secondary.url} alt="" aria-hidden="true" width="500" height="500" loading="lazy"/>}
  </>:<><div className="product-shadow"/><div className="product-bottle" style={{'--tone':product.color}}><span className="bottle-brand">{product.brand}</span><strong>{product.name}</strong><small>EAU DE PARFUM</small></div></>}
 </div>
}
