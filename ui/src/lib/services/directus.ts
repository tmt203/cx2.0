const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL

export async function getCollections() {
  const res = await fetch(`${DIRECTUS_URL}/collections`, {
    headers: { Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}` },
    next: { revalidate: 60 } // ISR cache 60 giây
  })
  const { data } = await res.json()
  // Lọc bỏ system collections (tên bắt đầu bằng "directus_")
  return data.filter((c: any) => !c.collection.startsWith('directus_'))
}