export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Field Reports Management API (MAPID)',
    version: '1.0.0',
    description:
      'Dokumentasi REST API Sistem Manajemen Laporan Lapangan. Mendukung Multi-Role (Admin, Pelapor, Approver), Audit Trail Riwayat Persetujuan, dan Manajemen Pengguna. Dibuat dengan Express.js, TypeScript, PostgreSQL, dan Prisma ORM.',
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
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan token JWT yang didapatkan dari login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Super Admin' },
          email: { type: 'string', example: 'admin@mapid.io' },
          role: { type: 'string', enum: ['admin', 'pelapor', 'approver'], example: 'admin' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ApprovalHistory: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          reportId: { type: 'integer', example: 2 },
          approverId: { type: 'integer', example: 2 },
          status: { type: 'string', enum: ['approved', 'rejected'], example: 'approved' },
          catatan: { type: 'string', example: 'Pekerjaan telah diverifikasi dan berfungsi baik.' },
          createdAt: { type: 'string', format: 'date-time' },
          approver: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 2 },
              name: { type: 'string', example: 'Bambang Verifikator' },
              role: { type: 'string', example: 'approver' },
            },
          },
        },
      },
      Report: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nama: { type: 'string', example: 'Kerusakan Pipa PDAM' },
          deskripsi: { type: 'string', example: 'Terjadi kebocoran pipa utama' },
          lokasi: { type: 'string', example: 'Jl. Sudirman No. 45' },
          pelapor: { type: 'string', example: 'Budi Santoso' },
          pelaporId: { type: 'integer', example: 3 },
          status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'pending' },
          catatan: { type: 'string', nullable: true, example: null },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          approvalHistories: {
            type: 'array',
            items: { $ref: '#/components/schemas/ApprovalHistory' },
          },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Autentikasi login dan profil pengguna' },
    { name: 'Users', description: 'Pengelolaan akun pengguna (Admin Only)' },
    { name: 'Reports', description: 'Pengelolaan laporan lapangan dan persetujuan' },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login pengguna',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@mapid.io' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login berhasil, mengembalikan token JWT' },
          '401': { description: 'Email atau password salah' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Ambil profil pengguna aktif',
        responses: {
          '200': { description: 'Profil pengguna berhasil diambil' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Daftar semua pengguna (Admin Only)',
        responses: {
          '200': { description: 'Daftar pengguna berhasil diambil' },
          '403': { description: 'Forbidden (bukan Admin)' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Buat akun pengguna baru (Admin Only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string', example: 'Doni Pratama' },
                  email: { type: 'string', example: 'doni@mapid.io' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['admin', 'pelapor', 'approver'], example: 'pelapor' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Pengguna berhasil dibuat' },
          '409': { description: 'Email sudah terdaftar' },
        },
      },
    },
    '/api/users/{id}': {
      delete: {
        tags: ['Users'],
        summary: 'Hapus pengguna (Admin Only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Pengguna berhasil dihapus' },
        },
      },
    },
    '/api/reports': {
      get: {
        tags: ['Reports'],
        summary: 'Daftar laporan lapangan',
        description: 'Pelapor hanya melihat laporannya sendiri. Admin & Approver melihat semua laporan.',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'pending', 'approved', 'rejected'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'oldest'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': { description: 'Daftar laporan' },
        },
      },
      post: {
        tags: ['Reports'],
        summary: 'Buat laporan baru (Pelapor & Admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nama', 'deskripsi'],
                properties: {
                  nama: { type: 'string', example: 'Tiang Listrik Miring' },
                  deskripsi: { type: 'string', example: 'Tiang listrik condong ke arah jalan raya' },
                  lokasi: { type: 'string', example: 'Jl. R.E. Martadinata No. 5' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Laporan berhasil dibuat' },
        },
      },
    },
    '/api/reports/stats': {
      get: {
        tags: ['Reports'],
        summary: 'Statistik status laporan',
        description: 'Pelapor hanya melihat statistik laporannya sendiri.',
        responses: {
          '200': { description: 'Statistik laporan' },
        },
      },
    },
    '/api/reports/{id}': {
      get: {
        tags: ['Reports'],
        summary: 'Detail laporan beserta riwayat persetujuan',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Detail laporan' },
          '403': { description: 'Pelapor mengakses laporan orang lain' },
        },
      },
      put: {
        tags: ['Reports'],
        summary: 'Edit laporan (Pelapor saat status pending, atau Admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nama: { type: 'string' },
                  deskripsi: { type: 'string' },
                  lokasi: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Laporan berhasil diperbarui' },
          '400': { description: 'Laporan bukan berstatus pending' },
        },
      },
      delete: {
        tags: ['Reports'],
        summary: 'Hapus laporan (Admin, atau Pelapor jika pending)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Laporan berhasil dihapus' },
        },
      },
    },
    '/api/reports/{id}/status': {
      patch: {
        tags: ['Reports'],
        summary: 'Approve / Reject laporan (Approver & Admin)',
        description: 'Approver dapat mengubah dari reject ke approve dan sebaliknya. Setiap perubahan dicatat ke riwayat persetujuan.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['approved', 'rejected'] },
                  catatan: { type: 'string', example: 'Laporan valid dan telah ditinjau.' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Status berhasil diubah dan riwayat persetujuan dicatat' },
        },
      },
    },
  },
};
