import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import prisma from "../../../database/datasource"

export default async function AdminHome() {

  const rolesAndCounts = await prisma.user.groupBy({
    by: 'role',
    _count: {
      _all: true,
    }
  })

  return <section className="mx-auto grid grid-cols-4 gap-3">

  {rolesAndCounts.map(r => <Card key={r.role} className="bg-slate-100 rounded-sm">
    <CardHeader>
      {r.role}s
    </CardHeader>
    <CardContent className="text-8xl text-slate-700 text-end">
      {r._count._all}
    </CardContent>
  </Card>)}
  

  </section>
}