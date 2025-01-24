<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && mb_strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
?>
<h1>Bootstrap grid examples</h1>
<p class="lead">Basic grid layouts to get you familiar with building within the Bootstrap grid system.</p>
<p>In these examples the <code>.themed-grid-col</code> class is added to the columns to add some theming. This is not a class that is available in Bootstrap by default.</p>

<h2 class="mt-4">Five grid tiers</h2>
<p>There are five tiers to the Bootstrap grid system, one for each range of devices we support. Each tier starts at a minimum viewport size and automatically applies to the larger devices unless overridden.</p>


<div class="bg-body-tertiary p-3 rounded">
    <div class=" mx-auto">

        <h1 class="display-5 fw-normal">Navbar with offcanvas examples</h1>
        <p class="fs-5">This example shows how responsive offcanvas menus work within the navbar. For positioning of navbars, checkout the <a href="../examples/navbar-static/">top</a> and <a href="../examples/navbar-fixed/">fixed top</a> examples.</p>
        <p>From the top down, you'll see a dark navbar, light navbar and a responsive navbar—each with offcanvases built in. Resize your browser window to the large breakpoint to see the toggle for the offcanvas.</p>

    </div>
</div>

<h2 class="mt-4">Five grid tiers</h2>
<p>There are five tiers to the Bootstrap grid system, one for each range of devices we support. Each tier starts at a minimum viewport size and automatically applies to the larger devices unless overridden.</p>
<?php  
} else {
    header("location: nada.php");
}

?>