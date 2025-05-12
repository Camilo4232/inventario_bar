$(document).ready(function () {
  // Cargar el historial de ventas
  $.get("php3/historial_ventas.php", function (data) {
      try {
          const ventas = JSON.parse(data);
          if (ventas.length === 0) {
              alert("No se encontraron ventas");
          }
          ventas.forEach(venta => {
              $("#tablaHistorialVentas").append(`
                  <tr>
                      <td>${venta.venta_id}</td>
                      <td>${venta.fecha}</td>
                      <td>${venta.vendedor}</td>
                      <td>${venta.total}</td>
                      <td>
                          <button class="btn btn-info" onclick="verDetallesVenta(${venta.venta_id})">Ver Detalles</button>
                      </td>
                  </tr>
              `);
          });
      } catch (e) {
          console.error("Error al procesar los datos: ", e);
          alert("Hubo un error al procesar las ventas.");
      }
  }).fail(function(jqXHR, textStatus, errorThrown) {
      console.error("Error en la solicitud AJAX: ", textStatus, errorThrown);
      alert("No se pudo cargar el historial de ventas. Intenta nuevamente.");
  });

  // Función para ver los detalles de una venta
  window.verDetallesVenta = function (ventaId) {
      $.get(`php3/detalles_venta.php?venta_id=${ventaId}`, function (data) {
          try {
              const detalles = JSON.parse(data);
              $("#tablaDetallesVenta").empty();
              let totalVenta = 0;
              detalles.forEach(detalle => {
                  totalVenta += detalle.subtotal;
                  $("#tablaDetallesVenta").append(`
                      <tr>
                          <td>${detalle.producto}</td>
                          <td>${detalle.cantidad}</td>
                          <td>${detalle.precio}</td>
                          <td>${detalle.subtotal}</td>
                      </tr>
                  `);
              });
              $("#totalVenta").text(`Total: $${totalVenta.toFixed(2)}`);
              $("#modalDetalles").modal('show');
          } catch (e) {
              console.error("Error al procesar los detalles de la venta: ", e);
              alert("Hubo un error al cargar los detalles de la venta.");
          }
      }).fail(function(jqXHR, textStatus, errorThrown) {
          console.error("Error en la solicitud AJAX de detalles de venta: ", textStatus, errorThrown);
          alert("No se pudieron cargar los detalles de la venta.");
      });
  };
});



  