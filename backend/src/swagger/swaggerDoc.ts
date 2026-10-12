export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Field Reports Management API (MAPID)',
    version: '1.0.0',
    description:
      'Dokumentasi REST API Sistem Manajemen Laporan Lapangan. Dibuat dengan Express.js, TypeScript, PostgreSQL, dan Prisma ORM.',
    contact: {
      name: 'Fullstack Developer Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    {
      name: 'Reports',
      description: 'Endpoint pengelolaan laporan lapangan (CRUD dan status approval)',
    },
  ],
  paths: {
    '/api/reports': {
      get: {
        tags: ['Reports'],
        summary: 'Tampilkan daftar laporan',
        description: 'Mendapatkan daftar semua laporan lapangan dengan filter status dan pencarian.',
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Filter status laporan',
            required: false,
            schema: {
              type: 'string',
              enum: ['all', 'pending', 'approved', 'rejected'],
              default: 'all',
            },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Pencarian kata kunci pada nama, deskripsi, lokasi, atau pelapor',
            required: false,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Nomor halaman',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Jumlah data per halaman',
            required: false,
            schema: {
              type: 'integer',
              default: 10,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Daftar laporan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Daftar laporan berhasil diambil' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Report' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 4 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Reports'],
        summary: 'Buat laporan baru',
        description: 'Menambahkan laporan lapangan baru ke database dengan status awal pending.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateReportRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Laporan baru berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Laporan baru berhasil dibuat' },
                    data: { $ref: '#/components/schemas/Report' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Data tidak valid',
          },
        },
      },
    },
    '/api/reports/stats': {
      get: {
        tags: ['Reports'],
        summary: 'Statistik laporan',
        description: 'Mendapatkan ringkasan jumlah laporan total, pending, approved, dan rejected.',
        responses: {
          '200': {
            description: 'Statistik laporan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Statistik laporan berhasil diambil' },
                    data: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 10 },
                        pending: { type: 'integer', example: 4 },
                        approved: { type: 'integer', example: 4 },
                        rejected: { type: 'integer', example: 2 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/reports/{id}': {
      get: {
        tags: ['Reports'],
        summary: 'Detail laporan',
        description: 'Mendapatkan data lengkap laporan berdasarkan ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID laporan',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Detail laporan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Report' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Laporan tidak ditemukan',
          },
        },
      },
      delete: {
        tags: ['Reports'],
        summary: 'Hapus laporan',
        description: 'Menghapus laporan berdasarkan ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID laporan',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Laporan berhasil dihapus',
          },
          '404': {
            description: 'Laporan tidak ditemukan',
          },
        },
      },
    },
    '/api/reports/{id}/status': {
      patch: {
        tags: ['Reports'],
        summary: 'Ubah status laporan (Approve / Reject)',
        description: 'Memperbarui status laporan menjadi approved atau rejected.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID laporan',
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateReportStatusRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Status laporan berhasil diubah',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: "Status laporan berhasil diubah menjadi 'approved'" },
                    data: { $ref: '#/components/schemas/Report' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Status tidak valid',
          },
          '404': {
            description: 'Laporan tidak ditemukan',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Report: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nama: { type: 'string', example: 'Kerusakan Pipa Air Utama' },
          deskripsi: {
            type: 'string',
            example: 'Pipa distribusi air bocor deras di persimpangan jalan.',
          },
          lokasi: { type: 'string', nullable: true, example: 'Jl. Sudirman No. 45' },
          pelapor: { type: 'string', nullable: true, example: 'Budi Santoso' },
          status: {
            type: 'string',
            enum: ['pending', 'approved', 'rejected'],
            example: 'pending',
          },
          catatan: {
            type: 'string',
            nullable: true,
            example: 'Tim teknis dijadwalkan verifikasi ke lokasi.',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateReportRequest: {
        type: 'object',
        required: ['nama', 'deskripsi'],
        properties: {
          nama: { type: 'string', minLength: 3, example: 'Kerusakan Pipa Air Utama' },
          deskripsi: {
            type: 'string',
            minLength: 5,
            example: 'Pipa distribusi air bocor deras di persimpangan jalan.',
          },
          lokasi: { type: 'string', example: 'Jl. Sudirman No. 45' },
          pelapor: { type: 'string', example: 'Budi Santoso' },
        },
      },
      UpdateReportStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['approved', 'rejected'],
            example: 'approved',
          },
          catatan: {
            type: 'string',
            example: 'Laporan disetujui, teknisi sudah ditugaskan.',
          },
        },
      },
    },
  },
};
