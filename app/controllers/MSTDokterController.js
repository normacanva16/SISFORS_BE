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

const Dokter = db.mst_dokter_model;
const User = db.mst_users_model;
const Role = db.mst_roles_model;

exports.create = async (req, res) => {
  const { nama, code, spesialis_id, jadwal_kerja, email, username, password } = req.body;
  try {
    await Dokter.create(
      {
        nama,
        code,
        spesialis_id,
        jadwal_kerja
      },
      {
        individualHooks: true,
      },
    )
      .then(async (result) => {
        const findDokter = await Dokter.findOne({
          where: {
            id: result.id,
          }
        })

        const findRole = await Role.findOne({ where: { name: 'dokter' } })

        await User.create({
          fullname: findDokter.nama,
          email,
          username,
          password: bcrypt.hashSync(password, 8),
          role_id: findRole.id,
          dokter_id: findDokter.id,
          is_active: 1
        })

        return response.successResponseWithData(res, 'success', findDokter);
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
    Dokter.findAndCountAll({
      limit,
      offset,
      search,
      searchFields: ['nama'],
      order: [['created_date', 'DESC']],
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
      attributes: ['id','code', 'nama', 'jadwal_kerja'],
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

