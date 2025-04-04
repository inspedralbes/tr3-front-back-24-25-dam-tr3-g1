from odoo import models, api

class ResPartner(models.Model):
    _inherit = 'res.partner'

    @api.model
    def create(self, vals):
        partner = super(ResPartner, self).create(vals)
        template = self.env.ref('partner_auto_email.email_template_new_partner')
        if template and partner.email:
            template.send_mail(partner.id, force_send=True)
        return partner
