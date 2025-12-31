import React from 'react'
import ProductTable from '@/components/products/productTable'
import PageTitle from '@/components/pageTitle/pageTitle'

export default function Products() {
  return (
   <main>
         <PageTitle
           title="Products"
           breadcrumbs={[
             { title: "Dashboard", href: "/dashboard/products" },
             { title: "Products" },
           ]}
         >
           
         </PageTitle>
         <div className=" container mx-auto ">
           <ProductTable />
         </div>
       </main>
  )
}
