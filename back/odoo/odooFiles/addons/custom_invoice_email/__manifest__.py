{
    'name': 'Custom Invoice Email',
    'version': '1.0',
    'category': 'Accounting',
    'summary': 'Envia facturas por correo automáticamente al validar.',
    'author': 'Eric',
    'depends': ['account'],
    'data': [
        'data/email_template.xml',
    ],
    'installable': True,
    'application': False,
}