import { asc, sql } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { db } from '@/lib/db/client'
import { datasetRecords } from '@/lib/db/schema'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 100

type GetDatasetPageInput = {
  page?: number
  pageSize?: number
}

export const getDatasetPage = createServerFn({ method: 'GET' })
  .inputValidator((input: GetDatasetPageInput) => input)
  .handler(async ({ data }) => {
    const page = Math.max(DEFAULT_PAGE, data.page ?? DEFAULT_PAGE)
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, data.pageSize ?? DEFAULT_PAGE_SIZE),
    )
    const offset = (page - 1) * pageSize

    const [countResult] = await db
      .select({ total: sql<number>`count(*)` })
      .from(datasetRecords)

    const total = countResult.total
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    const rows = await db
      .select({
        id: datasetRecords.id,
        fileName: datasetRecords.fileName,
        transcript: datasetRecords.transcript,
        splitType: datasetRecords.splitType,
        durationS: datasetRecords.durationS,
      })
      .from(datasetRecords)
      .orderBy(asc(datasetRecords.id))
      .limit(pageSize)
      .offset(offset)

    return {
      rows: rows.map((row) => ({
        ...row,
        audioUrl: `/audio/${row.fileName}`,
      })),
      page,
      pageSize,
      total,
      totalPages,
    }
  })
