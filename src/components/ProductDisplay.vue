<template>
    <section class="product-display">
        <div class="product-images-display">
            <div class="image-container">
                <img src="https://res.cloudinary.com/dqk28z6rq/image/upload/v1704274663/projects/Neckbook/website-images/Persian_Cat_Facts_History_Personality_and_Care___ASPCA_Pet_Health_Insurance___white_Persian_cat_resting_on_a_brown_sofa-min_rgtjby.jpg"/>
            </div>
        </div>
        <div class="product-actions">
            product-actions
        </div>
    </section>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
.product-display{
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 100;

    .product-images-display{
        height: 100%;
        flex: 1;
        background-color: #131211;
        
        .image-container{
            height: 100%;
            max-width: 900px;
            margin: auto;
            
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .product-actions{
        height: 100%;
        width: 360px;
    }
}
</style>