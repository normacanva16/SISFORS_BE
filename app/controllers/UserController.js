// Library
const bcrypt = require('bcryptjs');
const jwt = require('../helpers/jwt');

// UTILS

const response = require('../helpers/apiResponse');
const Sequelize = require('sequelize');

// MODEL

const db = require('../models/index');
const sequelize = db.sequelize;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;

const User = db.mst_users_model;
const Role = db.mst_roles_model;

exports.createUser = async (req, res) => {
  const { role_id, fullname, username, password, email } = req.body;

  const findRole = await Role.findOne({ where: { id: role_id } });

    await User.create(
      {
        role_id: findRole.id,
        fullname,
        email,
        username,
        password: bcrypt.hashSync(password, 8),
        is_active: 1,
      },
      {
        // user: req.user,
        individualHooks: true,
      },
    )
      .then(async (result) => {
        // payload response
        const finduser = await User.findOne({ where: { id: result.id } });

        return response.successResponseWithData(res, 'Success Create User', finduser);
      })

      .catch((err) => {
        res.status(500).send({ message: err.message });
      });

};

exports.listUser = async (req, res) => {
  const limit = req.query.size ? parseInt(req.query.size) : 10;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;


  User.findAndCountAll({
    attributes: [
      'id',
      'role_id',
      'fullname',
      'username',
      'email',
      'is_active',
      'created_date',
      'created_by',
      'updated_date',
      'updated_by',
      'deleted_date',
      'deleted_by'
    ],
    include: [
      {
        model: db.mst_roles_model,
        as: 'mst_roles',
        attributes: [
          'id',
          'name',
          'code'
        ],
      },
      {
        model: db.mst_dokter_model,
        as: 'mst_dokter',
        attributes: [
          'id','code', 'nama', 'jadwal_kerja'
        ],
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
      },
      {
        model: db.mst_pasien_model,
        as: 'mst_pasien',
        attributes: [
          'id', 'code', 'nama', 'usia', 'alamat'
        ],
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
      }
    ],
    limit,
    offset,
    order: [['created_date', 'DESC']],
    subQuery: false,
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
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  await User.destroy({
    where: { id: id },
    user: req.user,
    individualHooks: true,
  })
    .then((result) => {
      if (result == 0) return response.notFoundResponse(res, `User with id ${id} not found`);

      return response.successResponse(res, `success delete user with id ${id}`);
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

};

exports.updateUser = async (req, res) => {
  const { role_id, fullname, phone_number, email, username, password, is_active } = req.body;
  const { id } = req.params;

  let respassid;
  if (password == null || password === '') {
    const passQuery = `
    SELECT password FROM mst_users where id = '${id}' LIMIT 1`;

    respassid = await sequelize.query(passQuery, {
      type: QueryTypes.SELECT,
    });
  }

    await User.update(
      {
        role_id: role_id,
        fullname,
        email,
        phone_number,
        username,
        password: password != null && password != '' ? bcrypt.hashSync(password, 8) : respassid[0].password,
        is_active: is_active != null && is_active != '' ? is_active : 1
      },
      {
        where: { id: id },
      },
    )
      .then((result) => {
        if (result == 0) {
          return response.notFoundResponse(res, `User with id ${id} not found`);
        } else {
          return response.successResponse(res, `success updated user with id ${id}`);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });

              
 
};

exports.viewUser = async (req, res) => {
  const { id } = req.params;

  User.findByPk(id)
    .then(async (result) => {
      if (result != null) {
        const finduser = await User.findOne({
          where: { id: id },
          include: [
            {
              model: db.mst_roles_model,
              as: 'mst_roles',
              attributes: [
                'id',
                'name',
                'code'
              ],
            },
            {
              model: db.mst_dokter_model,
              as: 'mst_dokter',
              attributes: [
                'id','code', 'nama', 'jadwal_kerja'
              ],
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
            },
            {
              model: db.mst_pasien_model,
              as: 'mst_pasien',
              attributes: [
                'id', 'code', 'nama', 'usia', 'alamat'
              ],
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
            }
          ],
        })
        return response.successResponseWithData(res, 'success', finduser);
      } else {
        return response.notFoundResponse(res, `User with id ${id} not found`);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.login = async (req, res) => {
  const { password } = req.body;

  const isMatchPassword = await bcrypt.compare(password, req.user.password);
  try {
    if (isMatchPassword) {
      // Update token
      let refreshToken = req.user.token;
      console.log(req.user)
      if (!req.user.token || !jwt.verifyRefreshToken(req.user.token)) {
        const payloadRefreshToken = {
          email: req.user.email,
          id: req.user.id,
        };
        refreshToken = jwt.generateRefreshToken(payloadRefreshToken);
        console.log(refreshToken)
        await User.update(
          {
            token: refreshToken,
          },
          {
            where: { id: req.user.id },
          },
        );
      }
      const findrole = await Role.findOne({ where: { id: req.user.role_id }, attributes: ['id', 'name'] });

      const findUser = await User.findOne({ where: { id: req.user.id }, attributes: [ 'fullname'] });

      const data = {
        email: req.user.email,
        user_id: req.user.id,
        username: req.user.username,
        fullname: findUser.dataValues.fullname,
        role_id: findrole.id,
        role_name: findrole.name,
        token: refreshToken,
      };

      console.log(data);
      return response.successResponseWithData(res, 'login berhasil', data);
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.updateProfile = async (req, res) => {
  const { fullname, phone_number, email, username, password } = req.body;
  const { id } = req.params;

  let respassid;
  if (password == null || password === '') {
    const passQuery = `
    SELECT password FROM mst_users where id = '${id}' LIMIT 1`;

    respassid = await sequelize.query(passQuery, {
      type: QueryTypes.SELECT,
    });
  }

    await User.update(
      {
        fullname,
        email,
        username,
        phone_number,
        password: password != null && password != '' ? bcrypt.hashSync(password, 8) : respassid[0].password,
      },
      {
        where: { id: id },
      },
    )
      .then((result) => {
        if (result == 0) {
          return response.notFoundResponse(res, `User with id ${id} not found`);
        } else {
          return response.successResponse(res, `success updated user with id ${id}`);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });

             
 
};
