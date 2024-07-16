// Library

// UTILS

const response = require('../helpers/apiResponse');
const Sequelize = require('sequelize');

// MODEL

const db = require('../models/index');
const sequelize = db.sequelize;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;

const JadwalPeriksa = db.trx_jadwal_periksa_model;

exports.create = async (req, res) => {
  const { pasien_id, dokter_id, jadwal_periksa } = req.body;
  try {
    await JadwalPeriksa.create(
      {
        pasien_id,
        dokter_id,
        jadwal_periksa
      },
      {
        individualHooks: true,
      },
    )
      .then(async (result) => {
        const findJadwalPeriksa = await JadwalPeriksa.findOne({
          where: {
            id: result.id,
          }
        })
        return response.successResponseWithData(res, 'success', findJadwalPeriksa);
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
    JadwalPeriksa.findAndCountAll({
      limit,
      offset,
      search,
      searchFields: ['nama'],
      order: [['created_date', 'DESC']],
      include: [
        {
          model: db.mst_pasien_model,
          as: 'mst_pasien',
          attributes: [
            'code', 'nama', 'usia', 'alamat'
          ],
        },
        {
          model: db.mst_dokter_model,
          as: 'mst_dokter',
          include: [
            {
              model: db.mst_spesialis_model,
              as: 'mst_spesialis',
              attributes: [
                'id',
                'name',
                'code',
              ],
            },
          ],
          attributes: ['id', 'code', 'nama', 'jadwal_kerja'],
        },
      ],
      attributes: ['jadwal_periksa'],
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
    await JadwalPeriksa.destroy({
      where: { id: id },
    })
      .then(async(result) => {
        if (result == 0) return response.notFoundResponse(res, `Jadwal Periksa with id ${id} not found`);

        return response.successResponse(res, `success delete jadwal periksa with id ${id}`);
      })

      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};