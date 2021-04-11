const Profile = require('../models/Profile');

module.exports = {
  

  async index(req, res) {
    const profile = await Profile.get();
    return res.render(("profile"), { profile});
  },

  async update(req, res) {
    const profile = await Profile.get();
    
    // req.body para pegar os dados
    const data = req.body;
    // definir quantas semanas tem num ano: 52
    const weeksPerYear = 52;
    // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
    // total de horas trabalhadas na semana
    const weeksTotalHours = data["hours-per-day"] * data["days-per-week"];
    // horas trabalhadas no mês
    const monthlyTotalHours = weeksPerMonth * weeksTotalHours;
    // qual será o valor da minha hora?
    const valueHour = data["monthly-budget"] / monthlyTotalHours;

    await Profile.update({
      ...profile,
      ...req.body,
      "value-hour": valueHour
    });

    return res.redirect('/profile');
  }
}