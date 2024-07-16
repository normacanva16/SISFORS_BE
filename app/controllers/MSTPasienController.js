// Library
const bcrypt = require('bcryptjs');

// UTILS

const response = require('../helpers/apiResponse');
const Sequelize = require('sequelize');

// MODEL

const db = require('../models/index');
const sequelize = db.sequelize;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;

const Pasien = db.mst_pasien_model;
const Riwayat = db.trx_riwayat_pasien_model;
const User = db.mst_users_model;
const Role = db.mst_roles_model;
const JadwalPeriksa = db.trx_jadwal_periksa_model;

exports.create = async (req, res) => {
  const { nama, code, usia, alamat, riwayat, email, username, password } = req.body;
  try {
    await Pasien.create(
      {
        nama,
        code,
        usia,
        alamat
      },
      {
        individualHooks: true,
      },
    )
      .then(async (result) => {
        const findPasien = await Pasien.findOne({
          where: {
            id: result.id,
          }
        })

        const findRole = await Role.findOne({ where: { name: 'pasien' } })

        await User.create({
          fullname: findPasien.nama,
          email,
          username,
          password: bcrypt.hashSync(password, 8),
          role_id: findRole.id,
          pasien_id: findPasien.id,
          is_active: 1
        })

        await Riwayat.create({
          pasien_id: findPasien.id,
          riwayat
        })
        return response.successResponseWithData(res, 'success', findPasien);
      })

      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.list = (req, res) => {
  const limit = req.query.size ? parseInt(req.query.size) : 10;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  const search = req.query.search;

  try {
    Pasien.findAndCountAll({
      limit,
      offset,
      search,
      searchFields: ['nama'],
      include: [
        {
          model: db.trx_riwayat_pasien_model,
          as: 'trx_riwayat_pasien',
          attributes: [
            'id',
            'riwayat',
          ],
        },
      ],
      attributes: ['id', 'code', 'nama', 'usia', 'alamat'],
    })
      .then((data) => {
        const payload = {
          content: data.rows,
          totalData: data.count,
        };
        return response.successResponseWithData(res, 'success', payload);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    await Pasien.destroy({
      where: { id: id },
    })
      .then(async(result) => {
        if (result == 0) return response.notFoundResponse(res, `Dokter with id ${id} not found`);

        await Riwayat.destroy({
          where: { pasien_id: id },
        })

        await User.destroy({
          where: { pasien_id: id },
        })

        await JadwalPeriksa.destroy({
          where: { pasien_id: id },
        })

        return response.successResponse(res, `success delete produksi with id ${id}`);
      })

      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};