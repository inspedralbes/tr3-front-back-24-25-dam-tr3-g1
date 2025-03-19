from odoo import models, api

class AccountMove(models.Model):
    _inherit = 'account.move'

    def action_post(self):
        """Sobreescribe la validación de la factura para enviar el correo"""
        res = super(AccountMove, self).action_post()
        for invoice in self:
            if invoice.move_type == 'out_invoice' and invoice.partner_id.email:
                template = self.env.ref('custom_invoice_email.email_template_invoice_custom', raise_if_not_found=False)
                if template:
                    template.send_mail(invoice.id, force_send=True)
        return res