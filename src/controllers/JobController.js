const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobUtils = require('../utils/JobUtils');
const  yup = require('yup');

module.exports = {
  create(req, res) {
    return res.render("job", {job: {}});
  },

  async save(req, res) {

    const data = {
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"]
    }
    
    /*Validações*/
    const dataSchema = yup.object().shape({
      name: yup
        .string()
        .required("Nome do job é obrigatório!")
        .min(1, "Nome do job nao pode ser vazio"),
      "daily-hours": yup
        .number()
        .typeError("Número de horas por dia é obrigatório!")
        .min(1, "Número de horas por dia deve ser maior que 0!"),
      
      "total-hours": yup
        .number()
        .typeError("Número de estimativa de horas é obrigatório!")
        .min(1, "Número de estimativa de horas deve ser maior que 0!")
    });

    dataSchema.validate({
      ...data,
      name: data.name.trim()
    }, {abortEarly: false})
    .then(async (dataValided) => {
      await Job.create({
        ...dataValided,
        created_at: Date.now(),   // atribuindo uma nova data
      });

      return res.redirect('/');
    })
    .catch(async (err) => {
      const errs = await {
        name: (err.inner.find((messageError) => (messageError.path === 'name'))) || null,
        'daily-hours': (err.inner.find((messageError) => (messageError.path === 'daily-hours'))) || null,
        'total-hours': (err.inner.find((messageError) => (messageError.path === 'total-hours'))) || null
      }
      
      await req.flash("job_errors", errs);
      return res.render("job", {job: data});
    });
  },

  async show(req, res) {
    const jobId = req.params.id;
    const jobs = await Job.get();
    const profile = await Profile.get();

    const job = jobs.find(job => Number(job.id) === Number(jobId));

    if (!job) return res.send('Job not found!');

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },

  async update(req, res) {
    const jobId = req.params.id;
    

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
      created_at: Date.now()
    };

    /*Validações*/
    const dataSchema = yup.object().shape({
      name: yup
        .string()
        .required("Nome do job é obrigatório!")
        .min(1, "Nome do job nao pode ser vazio"),
      "daily-hours": yup
        .number()
        .typeError("Número de horas por dia é obrigatório!")
        .min(1, "Número de horas por dia deve ser maior que 0!"),
      
      "total-hours": yup
        .number()
        .typeError("Número de estimativa de horas é obrigatório!")
        .min(1, "Número de estimativa de horas deve ser maior que 0!")
    });

    dataSchema.validate({
      ...updatedJob,
      name: updatedJob.name.trim()
    }, {abortEarly: false})
    .then(async (dataValided) => {

      await Job.update(dataValided, jobId);

      res.redirect('/job/' + jobId);
    })
    .catch(async (err) => {
      let errs = {
        name: (err.inner.find((messageError) => (messageError.path === 'name'))) || null,
        'daily-hours': (err.inner.find((messageError) => (messageError.path === 'daily-hours'))) || null,
        'total-hours': (err.inner.find((messageError) => (messageError.path === 'total-hours'))) || null
      }
      
      errs = {
        name: errs.name?.errors[0],
        'daily-hours': errs['daily-hours']?.errors[0],
        'total-hours': errs['total-hours']?.errors[0],
      }

      await req.flash("job_errors", errs);
      
      res.redirect('/job/' + jobId);
    });
  },

  async delete(req, res) {
    const jobId = req.params.id;

    await Job.delete(jobId);

    return res.redirect('/');
  }
};