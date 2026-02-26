import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { getDatasetPage } from '@/lib/actions/dataset'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DatasetSearch = {
  page: number
  pageSize: number
}

export const Route = createFileRoute('/dataset')({
  validateSearch: (search): DatasetSearch => ({
    page: Number(search.page ?? 1) || 1,
    pageSize: Number(search.pageSize ?? 12) || 12,
  }),
  loaderDeps: ({ search }) => ({
    page: Math.max(1, search.page),
    pageSize: Math.max(1, search.pageSize),
  }),
  loader: ({ deps }) => getDatasetPage({ data: deps }),
  component: DatasetPage,
})

function DatasetPage() {
  const navigate = useNavigate({ from: '/dataset' })
  const search = Route.useSearch()
  const { rows, page, pageSize, total, totalPages } = Route.useLoaderData()

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const goToPage = (nextPage: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: Math.min(totalPages, Math.max(1, nextPage)),
        pageSize: search.pageSize,
      }),
    })
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-2 pt-2">
      <h1 className="text-2xl font-semibold tracking-tight">Datasets</h1>

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-card">
        <div className="h-full overflow-auto">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-[280px]" />
              <col />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>Audio</TableHead>
                <TableHead>Transcript</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-3 align-top">
                      <audio
                        controls
                        preload="metadata"
                        className="h-9 w-[250px] min-w-[250px]"
                      >
                        <source src={row.audioUrl} type="audio/wav" />
                      </audio>
                    </TableCell>
                    <TableCell className="max-w-0 py-3 align-top whitespace-normal">
                      <p
                        className="wrap-break-word text-sm leading-5"
                        title={row.transcript}
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {row.transcript}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-24 text-center whitespace-normal text-muted-foreground"
                  >
                    No dataset rows available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {start} to {end} of {total} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
