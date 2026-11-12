"use server";

import prisma from "@/database/datasource";
import type { TableQuery } from "@/components/tables/table-features";
import { UserWhereInput } from "@/database/prisma/models";

export async function searchUsers(tableState: TableQuery) {
  const skip = tableState.pagination.pageIndex * tableState.pagination.pageSize;
  const take = tableState.pagination.pageSize;

  // global search
  let where: UserWhereInput = tableState.globalFilter
    ? {
        OR: [
          { name: { contains: tableState.globalFilter } },
          { email: { startsWith: tableState.globalFilter } },
        ],
      }
    : {};

  // Specific column filters
  tableState.columnFilters?.forEach(col => {
    const values = col.value as unknown[];
    if (typeof values[0] === 'boolean') {
      where = {
        ...where,
        [col.id]: values[0]
      }
    } else {
      where = {
        ...where,
        [col.id] : {
          in: values
        }
      }
    }
  })

  // Sorting
  let orderBy = {}
  tableState.sorting.forEach(s => {
    orderBy = {
      ...orderBy,
      [s.id]: s.desc ? 'desc' : 'asc'
    }
  })

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}
